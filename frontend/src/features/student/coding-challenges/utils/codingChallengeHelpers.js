/**
 * Utility helpers for the Coding Challenges feature.
 * Pure functions only — no side effects, no React imports.
 */

import {
  DIFFICULTY_COLORS,
  VERDICT_COLORS,
  VERDICT_SHORT,
  CHALLENGE_STATUS_COLORS,
  SUPPORTED_LANGUAGES,
} from '../constants/codingChallengeConstants';

// ─── Language Helpers ──────────────────────────────────────────────────────────

/**
 * Get the display label for a language value.
 * @param {string} value - Language value (e.g. 'javascript').
 * @returns {string} Display label (e.g. 'JavaScript').
 */
export function getLanguageLabel(value) {
  const lang = SUPPORTED_LANGUAGES.find((l) => l.value === value);
  return lang ? lang.label : value;
}

/**
 * Get the Monaco editor language string for a language value.
 * @param {string} value
 * @returns {string}
 */
export function getMonacoLanguage(value) {
  const lang = SUPPORTED_LANGUAGES.find((l) => l.value === value);
  return lang ? lang.monacoLang : 'plaintext';
}

/**
 * Get the Judge0 language_id for a language value.
 * @param {string} value
 * @returns {number | null}
 */
export function getJudge0Id(value) {
  const lang = SUPPORTED_LANGUAGES.find((l) => l.value === value);
  return lang ? lang.judge0Id : null;
}

// ─── Styling Helpers ───────────────────────────────────────────────────────────

/**
 * Get Tailwind CSS classes for a difficulty level badge.
 * @param {string} difficulty
 * @returns {string}
 */
export function getDifficultyClasses(difficulty) {
  return DIFFICULTY_COLORS[difficulty] ?? 'bg-gray-700/20 text-gray-400 border border-gray-700';
}

/**
 * Get Tailwind CSS classes for a verdict badge.
 * @param {string} verdict
 * @returns {string}
 */
export function getVerdictClasses(verdict) {
  return VERDICT_COLORS[verdict] ?? 'bg-gray-700/20 text-gray-400 border border-gray-700';
}

/**
 * Get the short label for a verdict (e.g. "AC", "WA").
 * @param {string} verdict
 * @returns {string}
 */
export function getVerdictShort(verdict) {
  return VERDICT_SHORT[verdict] ?? verdict;
}

/**
 * Get Tailwind text color class for a challenge status.
 * @param {string} status
 * @returns {string}
 */
export function getChallengeStatusColor(status) {
  return CHALLENGE_STATUS_COLORS[status] ?? 'text-gray-500';
}

// ─── Formatting Helpers ────────────────────────────────────────────────────────

/**
 * Format a runtime in milliseconds to a human-readable string.
 * @param {number} ms
 * @returns {string} e.g. "68 ms" or "1.20 s"
 */
export function formatRuntime(ms) {
  if (ms === null || ms === undefined) return '—';
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

/**
 * Format memory usage in megabytes.
 * @param {number} mb
 * @returns {string} e.g. "42.3 MB"
 */
export function formatMemory(mb) {
  if (mb === null || mb === undefined) return '—';
  return `${mb.toFixed(1)} MB`;
}

/**
 * Format an ISO date string into a readable relative or absolute string.
 * @param {string} isoString
 * @returns {string}
 */
export function formatSubmissionDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format an acceptance rate number as a percentage string.
 * @param {number} rate
 * @returns {string} e.g. "52.3%"
 */
export function formatAcceptanceRate(rate) {
  if (rate === null || rate === undefined) return '—';
  return `${rate.toFixed(1)}%`;
}

/**
 * Format a large number with commas (e.g. 8240000 → "8,240,000").
 * @param {number} num
 * @returns {string}
 */
export function formatLargeNumber(num) {
  if (num === null || num === undefined) return '—';
  return num.toLocaleString('en-US');
}

// ─── Challenge List Helpers ────────────────────────────────────────────────────

/**
 * Filter challenges by difficulty.
 * @param {Array} challenges
 * @param {string} difficulty - 'All' or a specific difficulty.
 * @returns {Array}
 */
export function filterByDifficulty(challenges, difficulty) {
  if (!difficulty || difficulty === 'All') return challenges;
  return challenges.filter((c) => c.difficulty === difficulty);
}

/**
 * Filter challenges by topic tag.
 * @param {Array} challenges
 * @param {string} topic - 'All' or a specific topic.
 * @returns {Array}
 */
export function filterByTopic(challenges, topic) {
  if (!topic || topic === 'All') return challenges;
  return challenges.filter((c) => c.topics?.includes(topic));
}

/**
 * Filter challenges by status.
 * @param {Array} challenges
 * @param {string} status - 'All' or a specific status.
 * @returns {Array}
 */
export function filterByStatus(challenges, status) {
  if (!status || status === 'All') return challenges;
  return challenges.filter((c) => c.status === status);
}

/**
 * Search challenges by title or topic (case-insensitive).
 * @param {Array} challenges
 * @param {string} query
 * @returns {Array}
 */
export function searchChallenges(challenges, query) {
  if (!query || query.trim() === '') return challenges;
  const q = query.toLowerCase().trim();
  return challenges.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.topics?.some((t) => t.toLowerCase().includes(q))
  );
}

/**
 * Calculate the number of passed test cases from test results.
 * @param {Array} testResults
 * @returns {{ passed: number, total: number }}
 */
export function getTestCaseSummary(testResults) {
  if (!Array.isArray(testResults)) return { passed: 0, total: 0 };
  const total = testResults.length;
  const passed = testResults.filter((t) => t.passed).length;
  return { passed, total };
}
