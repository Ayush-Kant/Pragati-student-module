/**
 * Barrel exports for the Coding Challenges feature.
 *
 * Import pages and hooks from here to avoid long relative paths elsewhere.
 */

// ─── Pages ────────────────────────────────────────────────────────────────────
export { default as CodingChallengesPage }  from './pages/CodingChallengesPage';
export { default as ChallengeDetailsPage }  from './pages/ChallengeDetailsPage';
export { default as LeaderboardPage }       from './pages/LeaderboardPage';
export { default as SubmissionHistoryPage } from './pages/SubmissionHistoryPage';

// ─── Hooks ────────────────────────────────────────────────────────────────────
export { useCodingChallenges }       from './hooks/useCodingChallenges';
export { useChallengeDetails }       from './hooks/useChallengeDetails';
export { useCodeExecution }          from './hooks/useCodeExecution';
export { useLeaderboard }            from './hooks/useLeaderboard';
export { useSubmissionHistory }      from './hooks/useSubmissionHistory';
export { useBeforeUnload }           from './hooks/useBeforeUnload';
export { usePreventDuplicateRequest} from './hooks/usePreventDuplicateRequest';

// ─── Services ─────────────────────────────────────────────────────────────────
export {
  getCodingChallenges,
  getChallengeDetails,
  executeCode,
  submitSolution,
  getSubmissionHistory,
  getLeaderboard,
} from './services/codingChallengeService';

// ─── Constants ────────────────────────────────────────────────────────────────
export * from './constants/codingChallengeConstants';

// ─── Helpers ──────────────────────────────────────────────────────────────────
export * from './utils/codingChallengeHelpers';

// ─── Validations ──────────────────────────────────────────────────────────────
export * from './validations/codingChallengeValidation';
