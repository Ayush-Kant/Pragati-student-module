import { pool } from "../config/db.js";

const JUDGE0_BASE_URL = process.env.JUDGE0_API_URL;
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;

const resolveUserId = async (jwtUserId) => {
  const res = await pool.query(
    `SELECT users.id FROM users
     INNER JOIN auth_users ON auth_users.id = users.auth_user_id
     WHERE auth_users.uuid_id = $1`,
    [jwtUserId]
  );
  return res.rows[0]?.id ?? null;
};

// ==========================================
// 1. CREATE CHALLENGE
// ==========================================
export const createChallengeService = async ({ userId, title, description, maxScore, allowedLanguages }) => {
  const dbUserId = await resolveUserId(userId);
  if (!dbUserId) return { statusCode: 403, success: false, message: "User not found" };

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const assessmentRes = await client.query(
      `INSERT INTO assessments (title, type, difficulty, time_limit_minutes, total_marks, status, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [title.trim(), "Coding", "Medium", 60, maxScore, "draft", dbUserId]
    );
    const challengeId = assessmentRes.rows[0].id;

    const langValues = allowedLanguages.map((_, i) => `($1, $${i * 2 + 2}, $${i * 2 + 3})`).join(", ");
    const langParams = [challengeId];
    allowedLanguages.forEach((l) => langParams.push(l.languageId, l.languageName));

    await client.query(
      `INSERT INTO coding_languages (challenge_id, language_id, language_name) VALUES ${langValues}`,
      langParams
    );

    await client.query("COMMIT");
    return { statusCode: 201, success: true, challengeId };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// ==========================================
// 2. ADD TEST CASES
// ==========================================
export const addTestCasesService = async ({ challengeId, testCases }) => {
  const challengeRes = await pool.query(`SELECT id FROM assessments WHERE id = $1`, [challengeId]);
  if (challengeRes.rows.length === 0) return { statusCode: 404, success: false, message: "Challenge not found" };

  const valuesClause = testCases
    .map((_, i) => { const b = i * 5; return `($1, $${b + 2}, $${b + 3}, $${b + 4}, $${b + 5}, $${b + 6})`; })
    .join(", ");

  const params = [challengeId];
  testCases.forEach((tc) => params.push(tc.input, tc.expectedOutput, tc.isHidden ?? true, tc.weightPct, tc.timeLimitMs ?? 2000));

  await pool.query(
    `INSERT INTO coding_test_cases (challenge_id, input, expected_output, is_hidden, weight_pct, time_limit_ms) VALUES ${valuesClause}`,
    params
  );

  return { statusCode: 201, success: true, inserted: testCases.length };
};

// ==========================================
// 3. SUBMIT CODE — Judge0 batch evaluation
// ==========================================
export const submitCodeService = async ({ challengeId, userId, languageId, sourceCode }) => {
  const dbUserId = await resolveUserId(userId);
  if (!dbUserId) return { statusCode: 403, success: false, message: "Student not found" };

  const langRes = await pool.query(
    `SELECT id FROM coding_languages WHERE challenge_id = $1 AND language_id = $2`,
    [challengeId, languageId]
  );
  if (langRes.rows.length === 0) return { statusCode: 400, success: false, message: "Language not allowed for this challenge" };

  const tcRes = await pool.query(
    `SELECT id, input, expected_output, weight_pct, time_limit_ms FROM coding_test_cases WHERE challenge_id = $1`,
    [challengeId]
  );
  const testCases = tcRes.rows;
  if (testCases.length === 0) return { statusCode: 400, success: false, message: "No test cases found for this challenge" };

  let results;

  if (process.env.JUDGE0_MOCK === "true") {
    results = testCases.map((_, i) => ({
      status: { id: i % 2 === 0 ? 3 : 4 },
      time: (Math.random() * 0.1 + 0.02).toFixed(3),
    }));
  } else {
    const submissions = testCases.map((tc) => ({
      source_code: Buffer.from(sourceCode).toString("base64"),
      language_id: languageId,
      stdin: Buffer.from(tc.input).toString("base64"),
      expected_output: Buffer.from(tc.expected_output).toString("base64"),
      cpu_time_limit: (tc.time_limit_ms / 1000).toFixed(2),
    }));

    const judge0Headers = {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": JUDGE0_API_KEY,
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    };

    const batchRes = await fetch(`${JUDGE0_BASE_URL}/submissions/batch?base64_encoded=true`, {
      method: "POST",
      headers: judge0Headers,
      body: JSON.stringify({ submissions }),
    });
    if (!batchRes.ok) throw new Error(`Judge0 batch submit failed: ${batchRes.status}`);

    const tokens = await batchRes.json();
    const tokenList = tokens.map((t) => t.token).join(",");
    results = [];

    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 1500));
      const pollRes = await fetch(
        `${JUDGE0_BASE_URL}/submissions/batch?tokens=${tokenList}&base64_encoded=true&fields=status,stdout,time,stderr`,
        { headers: judge0Headers }
      );
      if (!pollRes.ok) throw new Error(`Judge0 poll failed: ${pollRes.status}`);
      const pollData = await pollRes.json();
      results = pollData.submissions;
      if (results.every((r) => r.status && r.status.id >= 3)) break;
    }
  }

  let totalScore = 0, passedCount = 0, maxExecTime = 0;
  for (let i = 0; i < testCases.length; i++) {
    const result = results[i];
    if (!result) continue;
    if (result.status?.id === 3) { totalScore += Number(testCases[i].weight_pct); passedCount++; }
    const execMs = result.time ? Math.round(parseFloat(result.time) * 1000) : 0;
    if (execMs > maxExecTime) maxExecTime = execMs;
  }

  const verdict = passedCount === 0 ? "Wrong Answer" : passedCount === testCases.length ? "Accepted" : "Partial Acceptance";

  const subRes = await pool.query(
    `INSERT INTO challenge_submissions
       (student_id, challenge_id, language_id, source_code, total_score, execution_time_ms, judge0_verdict, passed_test_cases, total_test_cases)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
    [dbUserId, challengeId, languageId, sourceCode, totalScore, maxExecTime, verdict, passedCount, testCases.length]
  );

  return {
    statusCode: 200, success: true,
    submissionId: subRes.rows[0].id,
    totalScore, passedTestCases: passedCount,
    totalTestCases: testCases.length,
    judge0Verdict: verdict, executionTimeMs: maxExecTime,
  };
};

// ==========================================
// 4. LEADERBOARD
// ==========================================
export const getLeaderboardService = async ({ challengeId }) => {
  const challengeRes = await pool.query(`SELECT id FROM assessments WHERE id = $1`, [challengeId]);
  if (challengeRes.rows.length === 0) return { statusCode: 404, success: false, message: "Challenge not found" };

  const lbRes = await pool.query(
    `SELECT
       RANK() OVER (ORDER BY cs.total_score DESC, cs.execution_time_ms ASC) AS rank,
       COALESCE(u.full_name, u.username, u.email) AS "studentName",
       cs.total_score AS score,
       cs.execution_time_ms AS "executionTimeMs",
       cs.submitted_at AS "submittedAt"
     FROM challenge_submissions cs
     INNER JOIN users u ON u.id = cs.student_id
     WHERE cs.challenge_id = $1
     ORDER BY cs.total_score DESC, cs.execution_time_ms ASC`,
    [challengeId]
  );

  return {
    statusCode: 200,
    challengeId: Number(challengeId),
    leaderboard: lbRes.rows.map((r) => ({
      rank: Number(r.rank),
      studentName: r.studentName,
      score: Number(r.score),
      executionTimeMs: r.executionTimeMs,
      submittedAt: r.submittedAt,
    })),
  };
};
