import { pool } from '../config/db.js';

const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
  c: 50,
  typescript: 74,
  go: 60,
  rust: 73,
};

const JUDGE0_BASE_URL = (process.env.JUDGE0_BASE_URL || 'https://ce.judge0.com').replace(/\/$/, '');
const POLL_INTERVAL_MS = 1000;
const POLL_LIMIT = 20;

const judgeHeaders = () => ({
  'Content-Type': 'application/json',
  ...(process.env.JUDGE0_API_KEY ? { 'X-Auth-Token': process.env.JUDGE0_API_KEY } : {}),
});

const normalizeVerdict = (statusId, description) => {
  const descriptions = {
    3: 'Accepted',
    4: 'Wrong Answer',
    5: 'Time Limit Exceeded',
    6: 'Compilation Error',
    7: 'Runtime Error',
    8: 'Runtime Error',
    9: 'Runtime Error',
    10: 'Runtime Error',
    11: 'Runtime Error',
    12: 'Runtime Error',
    13: 'Internal Error',
    14: 'Exec Format Error',
  };
  return descriptions[statusId] || description || 'Pending';
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const encode = (value) => Buffer.from(value ?? '', 'utf8').toString('base64');
const decode = (value) => {
  if (!value) return '';
  try {
    return Buffer.from(value, 'base64').toString('utf8');
  } catch {
    return String(value);
  }
};

const resolveLanguageId = (language) => {
  const languageId = LANGUAGE_IDS[language] || Number(language);
  if (!Number.isInteger(languageId) || languageId <= 0) {
    const error = new Error('Unsupported programming language');
    error.statusCode = 400;
    throw error;
  }
  return languageId;
};

const executeWithJudge0 = async ({ sourceCode, languageId, stdin, expectedOutput, timeLimitMs = 2000 }) => {
  const response = await fetch(`${JUDGE0_BASE_URL}/submissions?base64_encoded=true&wait=false`, {
    method: 'POST',
    headers: judgeHeaders(),
    body: JSON.stringify({
      source_code: encode(sourceCode),
      language_id: Number(languageId),
      stdin: encode(stdin),
      expected_output: expectedOutput == null ? undefined : encode(expectedOutput),
      cpu_time_limit: Math.max(Number(timeLimitMs) / 1000, 0.1),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    const error = new Error(`Judge0 request failed (${response.status})${body ? `: ${body.slice(0, 300)}` : ''}`);
    error.statusCode = response.status >= 500 ? 502 : 400;
    throw error;
  }

  const { token } = await response.json();
  if (!token) throw new Error('Judge0 did not return a submission token');

  for (let attempt = 0; attempt < POLL_LIMIT; attempt += 1) {
    await wait(POLL_INTERVAL_MS);
    const pollResponse = await fetch(
      `${JUDGE0_BASE_URL}/submissions/${token}?base64_encoded=true`,
      { headers: judgeHeaders() },
    );

    if (!pollResponse.ok) {
      const body = await pollResponse.text();
      const error = new Error(`Judge0 polling failed (${pollResponse.status})${body ? `: ${body.slice(0, 300)}` : ''}`);
      error.statusCode = 502;
      throw error;
    }

    const result = await pollResponse.json();
    if (result.status?.id > 2) {
      return {
        token,
        verdict: normalizeVerdict(result.status.id, result.status.description),
        statusId: result.status.id,
        statusDescription: result.status.description,
        stdout: decode(result.stdout),
        stderr: decode(result.stderr),
        compileOutput: decode(result.compile_output),
        message: decode(result.message),
        runtime: result.time ? Number(result.time) * 1000 : null,
        memory: result.memory ?? null,
      };
    }
  }

  return {
    verdict: 'Pending',
    statusId: 2,
    statusDescription: 'Processing',
    stdout: '',
    stderr: '',
    compileOutput: '',
    message: '',
    runtime: null,
    memory: null,
  };
};

const buildTestResult = (testCase, result, { exposeCaseData = true } = {}) => ({
  id: testCase.id,
  passed: result.verdict === 'Accepted',
  ...(exposeCaseData ? { input: testCase.input, expected: testCase.expectedOutput } : {}),
  actual: result.stdout.trim(),
  runtime: result.runtime,
  memory: result.memory,
  stderr: result.stderr || null,
  compileOutput: result.compileOutput || null,
  message: result.message || null,
  verdict: result.verdict,
  statusId: result.statusId,
  statusDescription: result.statusDescription,
});

const getChallengeRows = async (studentUserId) => {
  const result = await pool.query(
    `SELECT
       a.id,
       a.title,
       a.difficulty,
       a.total_marks AS "totalMarks",
       q.id AS "questionId",
       q.problem_statement AS "problemStatement",
       q.language_support AS "languageSupport",
       q.sample_input AS "sampleInput",
       q.sample_output AS "sampleOutput",
       COALESCE(MAX(cs.total_score), 0) AS "bestScore",
       CASE
         WHEN MAX(cs.total_score) >= 100 THEN 'Solved'
         WHEN COUNT(cs.id) > 0 THEN 'Attempted'
         ELSE 'Unsolved'
       END AS status
     FROM assessments a
     JOIN assessment_questions q
       ON q.assessment_id = a.id
      AND q.type IN ('Coding', 'coding')
     LEFT JOIN challenge_submissions cs
       ON cs.challenge_id = a.id
      AND cs.student_id = $1
     WHERE a.status = 'active'
     GROUP BY a.id, q.id
     ORDER BY a.id DESC`,
    [studentUserId],
  );

  const ids = result.rows.map((row) => row.id);
  if (!ids.length) return [];

  const testCaseResult = await pool.query(
    `SELECT challenge_id AS "challengeId", id, input, expected_output AS "expectedOutput", is_hidden AS "isHidden", time_limit_ms AS "timeLimitMs"
     FROM coding_test_cases
     WHERE challenge_id = ANY($1::int[])
     ORDER BY challenge_id, id`,
    [ids],
  );

  const testsByChallenge = new Map();
  for (const testCase of testCaseResult.rows) {
    if (!testsByChallenge.has(testCase.challengeId)) testsByChallenge.set(testCase.challengeId, []);
    testsByChallenge.get(testCase.challengeId).push(testCase);
  }

  return result.rows.map((row) => ({
    id: row.id,
    title: row.title,
    difficulty: row.difficulty,
    totalMarks: Number(row.totalMarks),
    problemStatement: row.problemStatement,
    languageSupport: row.languageSupport || Object.keys(LANGUAGE_IDS),
    sampleInput: row.sampleInput,
    sampleOutput: row.sampleOutput,
    sampleTestCases: (testsByChallenge.get(row.id) || [])
      .filter((item) => !item.isHidden)
      .map(({ id, input, expectedOutput }) => ({ id, input, expectedOutput })),
    bestScore: Number(row.bestScore || 0),
    status: row.status,
    topic: 'Algorithms',
    tags: ['Array', 'Dynamic Programming'],
  }));
};

export const listChallenges = async (studentUserId) => getChallengeRows(studentUserId);

export const getChallenge = async (studentUserId, challengeId) => {
  const challenges = await getChallengeRows(studentUserId);
  const challenge = challenges.find((item) => Number(item.id) === Number(challengeId));
  if (!challenge) {
    const error = new Error('Coding challenge not found');
    error.statusCode = 404;
    throw error;
  }
  return challenge;
};

const assertChallenge = async (challengeId) => {
  const result = await pool.query(
    `SELECT
       a.id, a.title, q.problem_statement AS "problemStatement",
       q.sample_input AS "sampleInput", q.sample_output AS "sampleOutput"
     FROM assessments a
     JOIN assessment_questions q ON q.assessment_id = a.id AND q.type IN ('Coding','coding')
     WHERE a.id = $1 AND a.status = 'active'
     LIMIT 1`,
    [challengeId],
  );
  if (!result.rows[0]) {
    const error = new Error('Coding challenge not found');
    error.statusCode = 404;
    throw error;
  }
  return result.rows[0];
};

const getTestCases = async (challengeId, hidden) => {
  const result = await pool.query(
    `SELECT id, input, expected_output AS "expectedOutput", is_hidden AS "isHidden", time_limit_ms AS "timeLimitMs"
     FROM coding_test_cases
     WHERE challenge_id = $1 AND is_hidden = $2
     ORDER BY id`,
    [challengeId, hidden],
  );
  return result.rows;
};

const runTests = async ({ tests, sourceCode, languageId, exposeCaseData = true }) => {
  const results = [];

  for (const testCase of tests) {
    const result = await executeWithJudge0({
      sourceCode,
      languageId,
      stdin: testCase.input,
      expectedOutput: testCase.expectedOutput,
      timeLimitMs: testCase.timeLimitMs,
    });
    results.push(buildTestResult(testCase, result, { exposeCaseData }));

    if (result.verdict !== 'Accepted') {
      // Preserve the first meaningful failure/diagnostic and avoid unnecessary execution.
      break;
    }
  }

  return results;
};

const firstDiagnostic = (results) => {
  const failure = results.find((item) => item.verdict !== 'Accepted');
  return {
    stderr: failure?.stderr || null,
    compileOutput: failure?.compileOutput || null,
    message: failure?.message || null,
    memory: failure?.memory ?? null,
    statusId: failure?.statusId ?? null,
    statusDescription: failure?.statusDescription || null,
  };
};

export const runCode = async (studentUserId, payload) => {
  const challengeId = Number(payload.challengeId);
  const challenge = await assertChallenge(challengeId);
  const publicTests = await getTestCases(challengeId, false);
  const tests = publicTests.length
    ? publicTests
    : [{ id: 0, input: challenge.sampleInput || '', expectedOutput: challenge.sampleOutput || '', timeLimitMs: 2000 }];

  const languageId = resolveLanguageId(payload.language);
  const testResults = await runTests({ tests, sourceCode: payload.code, languageId, exposeCaseData: true });
  const failure = testResults.find((item) => item.verdict !== 'Accepted');
  const verdict = failure?.verdict || (testResults.length ? 'Accepted' : 'Pending');
  const diagnostics = firstDiagnostic(testResults);

  return {
    verdict,
    runtime: testResults.reduce((max, item) => Math.max(max, Number(item.runtime || 0)), 0),
    memory: diagnostics.memory,
    testResults,
    stdout: testResults.map((item) => item.actual).filter(Boolean).join('\n'),
    stderr: diagnostics.stderr,
    compileOutput: diagnostics.compileOutput,
    message: diagnostics.message,
    statusId: diagnostics.statusId,
    statusDescription: diagnostics.statusDescription,
    challengeId,
  };
};

export const submitSolution = async (studentUserId, payload) => {
  const challengeId = Number(payload.challengeId);
  const challenge = await assertChallenge(challengeId);
  const hiddenTests = await getTestCases(challengeId, true);
  const publicTests = await getTestCases(challengeId, false);
  const tests = hiddenTests.length ? hiddenTests : publicTests;
  const exposeCaseData = hiddenTests.length === 0;

  if (!tests.length) {
    const error = new Error('This coding challenge has no test cases configured');
    error.statusCode = 422;
    throw error;
  }

  const languageId = resolveLanguageId(payload.language);
  const testResults = await runTests({ tests, sourceCode: payload.code, languageId, exposeCaseData });
  const passed = testResults.filter((result) => result.verdict === 'Accepted').length;
  const total = tests.length;
  const score = Math.round((passed / total) * 10000) / 100;
  const verdict = testResults.find((result) => result.verdict !== 'Accepted')?.verdict || 'Accepted';
  const runtime = testResults.reduce((max, result) => Math.max(max, Number(result.runtime || 0)), 0);
  const diagnostics = firstDiagnostic(testResults);

  const submission = await pool.query(
    `INSERT INTO challenge_submissions
       (student_id, challenge_id, language_id, source_code, total_score, execution_time_ms, judge0_verdict, passed_test_cases, total_test_cases)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING id, challenge_id AS "challengeId", total_score AS "score", execution_time_ms AS "runtime", judge0_verdict AS verdict,
               passed_test_cases AS "passedTestCases", total_test_cases AS "totalTestCases", submitted_at AS "submittedAt"`,
    [studentUserId, challengeId, languageId, payload.code, score, runtime, verdict, passed, total],
  );

  return {
    ...submission.rows[0],
    challengeTitle: challenge.title,
    language: payload.language,
    code: payload.code,
    testResults,
    status: verdict,
    stdout: testResults.map((item) => item.actual).filter(Boolean).join('\n'),
    stderr: diagnostics.stderr,
    compileOutput: diagnostics.compileOutput,
    message: diagnostics.message,
    memory: diagnostics.memory,
    statusId: diagnostics.statusId,
    statusDescription: diagnostics.statusDescription,
  };
};

export const getSubmissionHistory = async (studentUserId, challengeId = null) => {
  const params = [studentUserId];
  let where = 'student_id = $1';
  if (challengeId) {
    params.push(Number(challengeId));
    where += ' AND challenge_id = $2';
  }

  const result = await pool.query(
    `SELECT id, challenge_id AS "challengeId", language_id AS "languageId", total_score AS score,
            execution_time_ms AS runtime, judge0_verdict AS verdict,
            passed_test_cases AS "passedTestCases", total_test_cases AS "totalTestCases",
            submitted_at AS "submittedAt"
     FROM challenge_submissions
     WHERE ${where}
     ORDER BY submitted_at DESC
     LIMIT 100`,
    params,
  );
  return result.rows;
};

export const getLeaderboard = async (challengeId = null) => {
  const params = [];
  let where = '1=1';
  if (challengeId) {
    params.push(Number(challengeId));
    where = 'challenge_id = $1';
  }
  const result = await pool.query(
    `SELECT
       ROW_NUMBER() OVER (ORDER BY MAX(cs.total_score) DESC, MIN(cs.submitted_at) ASC) AS rank,
       COALESCE(s.name, u.full_name, 'Student') AS name,
       MAX(cs.total_score) AS score,
       COUNT(*) FILTER (WHERE cs.judge0_verdict = 'Accepted') AS "acceptedSubmissions"
     FROM challenge_submissions cs
     LEFT JOIN users u ON u.id = cs.student_id
     LEFT JOIN students s ON s.user_id = u.id
     WHERE ${where}
     GROUP BY u.id, u.full_name, s.id, s.name
     ORDER BY rank
     LIMIT 100`,
    params,
  );
  return result.rows.map((row) => ({
    rank: Number(row.rank),
    name: row.name || 'Student',
    studentName: row.name || 'Student',
    score: Number(row.score || 0),
    percentile: null,
    acceptedSubmissions: Number(row.acceptedSubmissions || 0),
  }));
};

export default {
  listChallenges,
  getChallenge,
  runCode,
  submitSolution,
  getSubmissionHistory,
  getLeaderboard,
};
