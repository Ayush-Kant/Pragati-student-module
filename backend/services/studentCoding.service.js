import { pool } from '../config/db.js';

const LANGUAGE_IDS = Object.freeze({ javascript: 63, python: 71, java: 62, cpp: 54 });
const MAX_CODE_LENGTH = 50_000;
const MAX_RUNS_PER_HOUR = 20;
const JUDGE0_BASE_URL = (process.env.JUDGE0_BASE_URL || 'https://ce.judge0.com').replace(/\/$/, '');
const POLL_INTERVAL_MS = 1000;
const POLL_LIMIT = 20;

const fail = (message, statusCode = 400) => { const error = new Error(message); error.statusCode = statusCode; return error; };
const normalizeLanguage = (language) => String(language || '').trim().toLowerCase();
const validateCodeLength = (code) => {
  if (typeof code !== 'string' || !code.trim()) throw fail('Code is required');
  if (code.length > MAX_CODE_LENGTH) throw fail(`Code must be ${MAX_CODE_LENGTH.toLocaleString()} characters or fewer`);
};
const resolveLanguageId = (language) => {
  const normalized = normalizeLanguage(language);
  const id = LANGUAGE_IDS[normalized];
  if (!id) throw fail('Unsupported programming language. Use JavaScript, Python, Java, or C++');
  return { language: normalized, languageId: id };
};
const normalizeVerdict = (statusId, description) => ({
  3: 'Accepted', 4: 'Wrong Answer', 5: 'Time Limit Exceeded', 6: 'Compilation Error',
  7: 'Runtime Error', 8: 'Runtime Error', 9: 'Runtime Error', 10: 'Runtime Error',
  11: 'Runtime Error', 12: 'Runtime Error', 13: 'Internal Error', 14: 'Exec Format Error',
}[statusId] || description || 'Pending');
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const encode = (value) => Buffer.from(value ?? '', 'utf8').toString('base64');
const decode = (value) => { if (!value) return ''; try { return Buffer.from(value, 'base64').toString('utf8'); } catch { return String(value); } };
const judgeHeaders = () => ({ 'Content-Type': 'application/json', ...(process.env.JUDGE0_API_KEY ? { 'X-Auth-Token': process.env.JUDGE0_API_KEY } : {}) });

const executeWithJudge0 = async ({ sourceCode, languageId, stdin, expectedOutput, timeLimitMs = 2000, memoryLimitMb = 256 }) => {
  const response = await fetch(`${JUDGE0_BASE_URL}/submissions?base64_encoded=true&wait=false`, {
    method: 'POST', headers: judgeHeaders(),
    body: JSON.stringify({ source_code: encode(sourceCode), language_id: Number(languageId), stdin: encode(stdin), expected_output: expectedOutput == null ? undefined : encode(expectedOutput), cpu_time_limit: Math.max(Number(timeLimitMs) / 1000, 0.1), memory_limit: Math.max(Number(memoryLimitMb) * 1024, 16_384) }),
  });
  if (!response.ok) { const body = await response.text(); throw fail(`Judge0 request failed (${response.status})${body ? `: ${body.slice(0, 300)}` : ''}`, response.status >= 500 ? 502 : 400); }
  const { token } = await response.json();
  if (!token) throw fail('Judge0 did not return a submission token', 502);
  for (let attempt = 0; attempt < POLL_LIMIT; attempt += 1) {
    await wait(POLL_INTERVAL_MS);
    const pollResponse = await fetch(`${JUDGE0_BASE_URL}/submissions/${token}?base64_encoded=true`, { headers: judgeHeaders() });
    if (!pollResponse.ok) { const body = await pollResponse.text(); throw fail(`Judge0 polling failed (${pollResponse.status})${body ? `: ${body.slice(0, 300)}` : ''}`, 502); }
    const result = await pollResponse.json();
    if (result.status?.id > 2) return {
      token, verdict: normalizeVerdict(result.status.id, result.status.description), statusId: result.status.id,
      statusDescription: result.status.description, stdout: decode(result.stdout), stderr: decode(result.stderr),
      compileOutput: decode(result.compile_output), message: decode(result.message), runtime: result.time ? Number(result.time) * 1000 : null, memory: result.memory ?? null,
    };
  }
  return { verdict: 'Pending', statusId: 2, statusDescription: 'Processing', stdout: '', stderr: '', compileOutput: '', message: '', runtime: null, memory: null };
};

const buildTestResult = (testCase, result, exposeCaseData) => ({
  id: testCase.id, passed: result.verdict === 'Accepted', ...(exposeCaseData ? { input: testCase.input, expected: testCase.expectedOutput } : {}),
  actual: result.stdout.trim(), runtime: result.runtime, memory: result.memory, stderr: result.stderr || null,
  compileOutput: result.compileOutput || null, message: result.message || null, verdict: result.verdict,
  statusId: result.statusId, statusDescription: result.statusDescription,
});

const getChallengeRow = async (challengeId) => {
  const result = await pool.query(`SELECT a.id, a.title, a.difficulty, a.total_marks AS "totalMarks", a.time_limit_minutes AS "timeLimitMinutes", a.start_at AS "startAt", a.due_at AS "dueAt", a.memory_limit_mb AS "memoryLimitMb", a.published_at AS "publishedAt", q.id AS "questionId", q.problem_statement AS "problemStatement", q.language_support AS "languageSupport", q.sample_input AS "sampleInput", q.sample_output AS "sampleOutput" FROM assessments a JOIN assessment_questions q ON q.assessment_id = a.id AND LOWER(q.type) = 'coding' WHERE a.id = $1 AND a.status = 'active' LIMIT 1`, [challengeId]);
  return result.rows[0] || null;
};
const getTestCases = async (challengeId, hidden) => (await pool.query(`SELECT id, input, expected_output AS "expectedOutput", is_hidden AS "isHidden", time_limit_ms AS "timeLimitMs" FROM coding_test_cases WHERE challenge_id = $1 AND is_hidden = $2 ORDER BY id`, [challengeId, hidden])).rows;
const getFinalSubmission = async (studentUserId, challengeId) => (await pool.query(`SELECT id, language_id AS "languageId", total_score AS score, execution_time_ms AS runtime, judge0_verdict AS verdict, passed_test_cases AS "passedTestCases", total_test_cases AS "totalTestCases", submitted_at AS "submittedAt", solve_time_seconds AS "solveTimeSeconds" FROM challenge_submissions WHERE student_id = $1 AND challenge_id = $2 AND submission_type = 'final' AND is_final = TRUE ORDER BY submitted_at DESC LIMIT 1`, [studentUserId, challengeId])).rows[0] || null;
const getRunCountLastHour = async (studentUserId, challengeId) => Number((await pool.query(`SELECT COUNT(*)::int AS count FROM challenge_submissions WHERE student_id = $1 AND challenge_id = $2 AND submission_type = 'run' AND submitted_at >= NOW() - INTERVAL '1 hour'`, [studentUserId, challengeId])).rows[0]?.count || 0);
const assertChallenge = async (challengeId) => { const challenge = await getChallengeRow(challengeId); if (!challenge) throw fail('Coding challenge not found', 404); return challenge; };
const assertWindow = (challenge) => { const now = Date.now(); if (challenge.startAt && now < new Date(challenge.startAt).getTime()) throw fail('This coding challenge has not started yet', 403); if (challenge.dueAt && now > new Date(challenge.dueAt).getTime()) throw fail('The coding challenge deadline has passed', 403); };
const assertNoFinal = async (studentUserId, challengeId) => { if (await getFinalSubmission(studentUserId, challengeId)) throw fail('A final submission already exists for this challenge; editing is locked.', 409); };
const runTests = async ({ tests, sourceCode, languageId, memoryLimitMb, exposeCaseData }) => { const results = []; for (const testCase of tests) { const result = await executeWithJudge0({ sourceCode, languageId, stdin: testCase.input, expectedOutput: testCase.expectedOutput, timeLimitMs: testCase.timeLimitMs || 2000, memoryLimitMb }); results.push(buildTestResult(testCase, result, exposeCaseData)); if (result.verdict !== 'Accepted') break; } return results; };
const diagnostics = (results) => { const failure = results.find((item) => item.verdict !== 'Accepted'); return { stderr: failure?.stderr || null, compileOutput: failure?.compileOutput || null, message: failure?.message || null, memory: failure?.memory ?? null, statusId: failure?.statusId ?? null, statusDescription: failure?.statusDescription || null }; };

export const listChallenges = async (studentUserId) => {
  const result = await pool.query(`SELECT a.id, a.title, a.difficulty, a.total_marks AS "totalMarks", a.time_limit_minutes AS "timeLimitMinutes", a.start_at AS "startAt", a.due_at AS "dueAt", q.id AS "questionId", q.problem_statement AS "problemStatement", q.language_support AS "languageSupport", q.sample_input AS "sampleInput", q.sample_output AS "sampleOutput", COALESCE(MAX(cs.total_score) FILTER (WHERE cs.submission_type = 'final'), 0) AS "bestScore", MAX(cs.submitted_at) FILTER (WHERE cs.submission_type = 'final') AS "lastSubmittedAt" FROM assessments a JOIN assessment_questions q ON q.assessment_id = a.id AND LOWER(q.type) = 'coding' LEFT JOIN challenge_submissions cs ON cs.challenge_id = a.id AND cs.student_id = $1 WHERE a.status = 'active' GROUP BY a.id, q.id ORDER BY a.id DESC`, [studentUserId]);
  const ids = result.rows.map((row) => row.id);
  if (!ids.length) return [];
  const cases = await pool.query(`SELECT challenge_id AS "challengeId", id, input, expected_output AS "expectedOutput", is_hidden AS "isHidden" FROM coding_test_cases WHERE challenge_id = ANY($1::int[]) ORDER BY challenge_id, id`, [ids]);
  const byChallenge = new Map();
  for (const item of cases.rows) { if (!byChallenge.has(item.challengeId)) byChallenge.set(item.challengeId, []); byChallenge.get(item.challengeId).push(item); }
  return result.rows.map((row) => ({ id: row.id, title: row.title, difficulty: row.difficulty, totalMarks: Number(row.totalMarks), timeLimitMinutes: Number(row.timeLimitMinutes || 0), startAt: row.startAt, dueAt: row.dueAt, problemStatement: row.problemStatement, languageSupport: (row.languageSupport || Object.keys(LANGUAGE_IDS)).map(normalizeLanguage).filter((language) => LANGUAGE_IDS[language]), sampleInput: row.sampleInput, sampleOutput: row.sampleOutput, sampleTestCases: (byChallenge.get(row.id) || []).filter((item) => !item.isHidden).map(({ id, input, expectedOutput }) => ({ id, input, expectedOutput })), bestScore: Number(row.bestScore || 0), status: row.lastSubmittedAt ? (Number(row.bestScore || 0) >= 100 ? 'Solved' : 'Attempted') : 'Unsolved', topic: 'Algorithms', tags: ['Array', 'Dynamic Programming'] }));
};

export const getChallenge = async (studentUserId, challengeId) => {
  const challenge = await assertChallenge(Number(challengeId));
  const publicTests = await getTestCases(challenge.id, false);
  const finalSubmission = await getFinalSubmission(studentUserId, challenge.id);
  return { id: challenge.id, title: challenge.title, difficulty: challenge.difficulty, totalMarks: Number(challenge.totalMarks), timeLimitMinutes: Number(challenge.timeLimitMinutes || 0), startAt: challenge.startAt, dueAt: challenge.dueAt, memoryLimitMb: Number(challenge.memoryLimitMb || 256), problemStatement: challenge.problemStatement, languageSupport: (challenge.languageSupport || Object.keys(LANGUAGE_IDS)).map(normalizeLanguage).filter((language) => LANGUAGE_IDS[language]), sampleInput: challenge.sampleInput, sampleOutput: challenge.sampleOutput, sampleTestCases: publicTests.map(({ id, input, expectedOutput }) => ({ id, input, expectedOutput })), finalSubmission, finalSubmissionLocked: Boolean(finalSubmission) };
};

export const runCode = async (studentUserId, payload) => {
  const challengeId = Number(payload.challengeId); const challenge = await assertChallenge(challengeId); assertWindow(challenge); await assertNoFinal(studentUserId, challengeId); validateCodeLength(payload.code); const { language, languageId } = resolveLanguageId(payload.language);
  const runCount = await getRunCountLastHour(studentUserId, challengeId); if (runCount >= MAX_RUNS_PER_HOUR) throw fail('Run limit reached for this challenge. Maximum 20 runs per hour.', 429);
  const tests = await getTestCases(challengeId, false); const effectiveTests = tests.length ? tests : [{ id: 0, input: challenge.sampleInput || '', expectedOutput: challenge.sampleOutput || '', timeLimitMs: 2000 }];
  const testResults = await runTests({ tests: effectiveTests, sourceCode: payload.code, languageId, memoryLimitMb: challenge.memoryLimitMb, exposeCaseData: true });
  const failure = testResults.find((item) => item.verdict !== 'Accepted'); const verdict = failure?.verdict || 'Accepted'; const info = diagnostics(testResults); const runtime = testResults.reduce((max, item) => Math.max(max, Number(item.runtime || 0)), 0);
  await pool.query(`INSERT INTO challenge_submissions (student_id, challenge_id, language_id, source_code, total_score, execution_time_ms, judge0_verdict, passed_test_cases, total_test_cases, submission_type, is_final) VALUES ($1,$2,$3,$4,0,$5,$6,$7,$8,'run',FALSE)`, [studentUserId, challengeId, languageId, payload.code, runtime, verdict, testResults.filter((item) => item.verdict === 'Accepted').length, effectiveTests.length]);
  return { verdict, runtime, memory: info.memory, testResults, stdout: testResults.map((item) => item.actual).filter(Boolean).join('\n'), stderr: info.stderr, compileOutput: info.compileOutput, message: info.message, statusId: info.statusId, statusDescription: info.statusDescription, runsRemaining: MAX_RUNS_PER_HOUR - runCount - 1, challengeId, language };
};

export const submitSolution = async (studentUserId, payload) => {
  const challengeId = Number(payload.challengeId); const challenge = await assertChallenge(challengeId); assertWindow(challenge); validateCodeLength(payload.code); const { language, languageId } = resolveLanguageId(payload.language);
  const publicTests = await getTestCases(challengeId, false); const hiddenTests = await getTestCases(challengeId, true); const allTests = [...publicTests, ...hiddenTests]; if (!allTests.length) throw fail('This coding challenge has no test cases configured', 422);
  const results = await runTests({ tests: allTests, sourceCode: payload.code, languageId, memoryLimitMb: challenge.memoryLimitMb, exposeCaseData: false }); const passed = results.filter((item) => item.verdict === 'Accepted').length; const total = allTests.length; const score = Math.round((passed / total) * 10000) / 100; const verdict = results.find((item) => item.verdict !== 'Accepted')?.verdict || 'Accepted'; const runtime = results.reduce((max, item) => Math.max(max, Number(item.runtime || 0)), 0); const info = diagnostics(results); const start = challenge.startAt ? new Date(challenge.startAt).getTime() : (challenge.publishedAt ? new Date(challenge.publishedAt).getTime() : Date.now()); const solveTimeSeconds = Math.max(0, Math.round((Date.now() - start) / 1000));
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const lockCheck = await client.query(`SELECT 1 FROM challenge_submissions WHERE student_id = $1 AND challenge_id = $2 AND submission_type = 'final' AND is_final = TRUE LIMIT 1 FOR UPDATE`, [studentUserId, challengeId]);
    if (lockCheck.rows.length) throw fail('A final submission already exists for this challenge; editing is locked.', 409);
    const submission = await client.query(`INSERT INTO challenge_submissions (student_id, challenge_id, language_id, source_code, total_score, execution_time_ms, judge0_verdict, passed_test_cases, total_test_cases, submission_type, is_final, solve_time_seconds) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'final',TRUE,$10) RETURNING id, challenge_id AS "challengeId", total_score AS score, execution_time_ms AS runtime, judge0_verdict AS verdict, passed_test_cases AS "passedTestCases", total_test_cases AS "totalTestCases", submitted_at AS "submittedAt", solve_time_seconds AS "solveTimeSeconds"`, [studentUserId, challengeId, languageId, payload.code, score, runtime, verdict, passed, total, solveTimeSeconds]);
    await client.query('COMMIT');
    return { ...submission.rows[0], challengeTitle: challenge.title, language, code: payload.code, testResults: results, status: verdict, stdout: results.map((item) => item.actual).filter(Boolean).join('\n'), stderr: info.stderr, compileOutput: info.compileOutput, message: info.message, memory: info.memory, statusId: info.statusId, statusDescription: info.statusDescription, isFinal: true, locked: true };
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
};

export const getSubmissionHistory = async (studentUserId, challengeId = null) => {
  const params = [studentUserId]; let where = 'student_id = $1'; if (challengeId) { params.push(Number(challengeId)); where += ' AND challenge_id = $2'; }
  return (await pool.query(`SELECT id, challenge_id AS "challengeId", language_id AS "languageId", total_score AS score, execution_time_ms AS runtime, judge0_verdict AS verdict, passed_test_cases AS "passedTestCases", total_test_cases AS "totalTestCases", submitted_at AS "submittedAt", submission_type AS "submissionType", is_final AS "isFinal", solve_time_seconds AS "solveTimeSeconds" FROM challenge_submissions WHERE ${where} ORDER BY submitted_at DESC LIMIT 100`, params)).rows;
};

export const getLeaderboard = async (challengeId = null) => {
  const params = []; let where = "cs.submission_type = 'final' AND cs.is_final = TRUE"; if (challengeId) { params.push(Number(challengeId)); where += ' AND cs.challenge_id = $1'; }
  const result = await pool.query(`SELECT ROW_NUMBER() OVER (ORDER BY MAX(cs.total_score) DESC, MIN(cs.submitted_at) ASC) AS rank, COALESCE(s.name, u.full_name, 'Student') AS name, MAX(cs.total_score) AS score, COUNT(*) FILTER (WHERE cs.judge0_verdict = 'Accepted') AS "acceptedSubmissions", MIN(cs.solve_time_seconds) AS "solveTimeSeconds" FROM challenge_submissions cs LEFT JOIN users u ON u.id = cs.student_id LEFT JOIN students s ON s.user_id = u.id WHERE ${where} GROUP BY u.id, u.full_name, s.id, s.name ORDER BY rank LIMIT 100`, params);
  return result.rows.map((row) => ({ rank: Number(row.rank), name: row.name, score: Number(row.score || 0), acceptedSubmissions: Number(row.acceptedSubmissions || 0), solveTimeSeconds: Number(row.solveTimeSeconds || 0) }));
};
