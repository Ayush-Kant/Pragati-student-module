/**
 * Service layer for Coding Challenges.
 * All data operations are centralised here.
 *
 * Currently backed by in-memory dummy data.
 * To integrate with the real backend, replace each function body with the
 * appropriate `fetch(...)` / `axios` call — all signatures and return shapes
 * are designed to stay identical, so no caller changes are needed.
 *
 * Judge0 integration is prepared via the `executeCode` / `submitSolution`
 * stubs.  Replace the dummy logic with the real Judge0 API calls when ready.
 */

import {
  dummyChallenges,
  dummySubmissions,
  dummyLeaderboard,
} from '../types/codingChallengeDummyData';
import { VERDICT } from '../constants/codingChallengeConstants';

// ─── Environment ──────────────────────────────────────────────────────────────
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const JUDGE0_URL   = import.meta.env.VITE_JUDGE0_URL;

const MOCK_DELAY_MS = 600;

// ─── Private Helpers ──────────────────────────────────────────────────────────

/**
 * Simulated network latency.
 * @param {number} [ms]
 * @returns {Promise<void>}
 */
function delay(ms = MOCK_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @template T
 * @param {T} data
 * @returns {{ success: true, data: T, error: null }}
 */
function wrapSuccess(data) {
  return { success: true, data, error: null };
}

/**
 * @param {string} [message]
 * @returns {{ success: false, data: null, error: string }}
 */
function wrapError(message = 'An unexpected error occurred.') {
  return { success: false, data: null, error: message };
}

/**
 * Deep-clone to prevent callers from mutating the in-memory store.
 * @template T
 * @param {T} value
 * @returns {T}
 */
function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

/** In-memory mutable copy of the challenge store. */
let challengeStore = dummyChallenges.map((c) => ({ ...c }));

/** In-memory mutable copy of the submissions store. */
let submissionStore = [...dummySubmissions];

// ─── Public Service Methods ───────────────────────────────────────────────────

/**
 * Fetch all coding challenges.
 *
 * @returns {Promise<{ success: boolean, data: object[] | null, error: string | null }>}
 */
export async function getCodingChallenges() {
  try {
    await delay();
    // TODO: Replace with real API call.
    // const res = await fetch(`${API_BASE_URL}/coding-challenges`);
    // if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // return wrapSuccess(await res.json());
    return wrapSuccess(challengeStore.map((c) => deepClone(c)));
  } catch (err) {
    return wrapError(err.message || 'Failed to fetch challenges.');
  }
}

/**
 * Fetch details for a single challenge.
 *
 * @param {string} challengeId
 * @returns {Promise<{ success: boolean, data: object | null, error: string | null }>}
 */
export async function getChallengeDetails(challengeId) {
  try {
    await delay();
    // TODO: Replace with real API call.
    // const res = await fetch(`${API_BASE_URL}/coding-challenges/${challengeId}`);
    // if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // return wrapSuccess(await res.json());
    const challenge = challengeStore.find((c) => c.id === challengeId);
    if (!challenge) return wrapError(`Challenge "${challengeId}" not found.`);
    return wrapSuccess(deepClone(challenge));
  } catch (err) {
    return wrapError(err.message || 'Failed to fetch challenge details.');
  }
}

/**
 * Execute code against sample test cases (Judge0-ready).
 *
 * @param {{ challengeId: string, language: string, code: string }} payload
 * @returns {Promise<{ success: boolean, data: object | null, error: string | null }>}
 */
export async function executeCode(payload) {
  try {
    await delay(1200);
    // TODO: Replace with real Judge0 API call.
    // const body = {
    //   source_code: btoa(payload.code),
    //   language_id: getJudge0Id(payload.language),
    //   stdin: btoa(testInput),
    // };
    // const res = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=true`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(body),
    // });
    // if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // const { token } = await res.json();
    // Poll for result…

    // ── Dummy simulation ──────────────────────────────────────────────────────
    const challenge = challengeStore.find((c) => c.id === payload.challengeId);
    if (!challenge) return wrapError(`Challenge "${payload.challengeId}" not found.`);

    const testResults = (challenge.sampleTestCases ?? []).map((tc) => {
      const passed = Math.random() > 0.3;
      return {
        id: tc.id,
        passed,
        input: tc.input,
        expected: tc.expectedOutput,
        actual: passed ? tc.expectedOutput : 'Wrong output',
        runtime: Math.floor(Math.random() * 80) + 5,
        stderr: null,
      };
    });

    const allPassed = testResults.every((t) => t.passed);

    return wrapSuccess({
      verdict: allPassed ? VERDICT.ACCEPTED : VERDICT.WRONG_ANSWER,
      runtime: Math.floor(Math.random() * 100) + 20,
      memory: parseFloat((Math.random() * 10 + 40).toFixed(1)),
      testResults,
      stderr: null,
      stdout: null,
    });
  } catch (err) {
    return wrapError(err.message || 'Code execution failed.');
  }
}

/**
 * Submit a solution for final evaluation against all (hidden) test cases.
 *
 * @param {{ challengeId: string, language: string, code: string }} payload
 * @returns {Promise<{ success: boolean, data: object | null, error: string | null }>}
 */
export async function submitSolution(payload) {
  try {
    await delay(2000);
    // TODO: Replace with real API call (which proxies to Judge0 and stores result).
    // const res = await fetch(`${API_BASE_URL}/coding-challenges/${payload.challengeId}/submissions`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload),
    // });
    // if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // return wrapSuccess(await res.json());

    // ── Dummy simulation ──────────────────────────────────────────────────────
    const challenge = challengeStore.find((c) => c.id === payload.challengeId);
    if (!challenge) return wrapError(`Challenge "${payload.challengeId}" not found.`);

    const accepted = Math.random() > 0.25;
    const verdict = accepted ? VERDICT.ACCEPTED : VERDICT.WRONG_ANSWER;
    const runtime = Math.floor(Math.random() * 150) + 20;
    const memory = parseFloat((Math.random() * 15 + 38).toFixed(1));

    const testResults = (challenge.sampleTestCases ?? []).map((tc) => ({
      id: tc.id,
      passed: accepted,
      input: tc.input,
      expected: tc.expectedOutput,
      actual: accepted ? tc.expectedOutput : 'Incorrect output',
      runtime,
    }));

    const submission = {
      id: `sub-${Date.now()}`,
      challengeId: payload.challengeId,
      challengeTitle: challenge.title,
      language: payload.language,
      verdict,
      runtime,
      memory,
      submittedAt: new Date().toISOString(),
      code: payload.code,
      testResults,
    };

    // Persist to in-memory store
    submissionStore = [submission, ...submissionStore];

    // Update challenge status in store
    if (accepted) {
      challengeStore = challengeStore.map((c) =>
        c.id === payload.challengeId ? { ...c, status: 'Solved' } : c
      );
    } else {
      challengeStore = challengeStore.map((c) =>
        c.id === payload.challengeId && c.status === 'Unsolved'
          ? { ...c, status: 'Attempted' }
          : c
      );
    }

    return wrapSuccess(deepClone(submission));
  } catch (err) {
    return wrapError(err.message || 'Solution submission failed.');
  }
}

/**
 * Fetch submission history, optionally filtered by challengeId.
 *
 * @param {string | null} [challengeId]
 * @returns {Promise<{ success: boolean, data: object[] | null, error: string | null }>}
 */
export async function getSubmissionHistory(challengeId = null) {
  try {
    await delay();
    // TODO: Replace with real API call.
    // const url = challengeId
    //   ? `${API_BASE_URL}/submissions?challengeId=${challengeId}`
    //   : `${API_BASE_URL}/submissions`;
    // const res = await fetch(url);
    // if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // return wrapSuccess(await res.json());

    const filtered = challengeId
      ? submissionStore.filter((s) => s.challengeId === challengeId)
      : submissionStore;

    return wrapSuccess(filtered.map((s) => deepClone(s)));
  } catch (err) {
    return wrapError(err.message || 'Failed to fetch submission history.');
  }
}

/**
 * Fetch leaderboard, optionally scoped to a challengeId.
 *
 * @param {string | null} [challengeId]
 * @returns {Promise<{ success: boolean, data: object[] | null, error: string | null }>}
 */
export async function getLeaderboard(challengeId = null) {
  try {
    await delay();
    // TODO: Replace with real API call.
    // const url = challengeId
    //   ? `${API_BASE_URL}/leaderboard?challengeId=${challengeId}`
    //   : `${API_BASE_URL}/leaderboard`;
    // const res = await fetch(url);
    // if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // return wrapSuccess(await res.json());

    // Dummy data is global; a real API would filter per challenge.
    void challengeId;
    return wrapSuccess(deepClone(dummyLeaderboard));
  } catch (err) {
    return wrapError(err.message || 'Failed to fetch leaderboard.');
  }
}

const codingChallengeService = {
  getCodingChallenges,
  getChallengeDetails,
  executeCode,
  submitSolution,
  getSubmissionHistory,
  getLeaderboard,
};

export default codingChallengeService;
