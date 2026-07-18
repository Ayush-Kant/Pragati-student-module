/**
 * assessments.constants.js
 *
 * Single source of truth for every hardcoded value used across the
 * assessments-quizzes module. Never use raw string literals for statuses,
 * error codes, or limit values.
 */

// ─── Assessment lifecycle ─────────────────────────────────────────────────────

/** Lifecycle statuses stored in the `assessments` table. */
export const ASSESSMENT_STATUS = Object.freeze({
  ACTIVE:   "active",
  DRAFT:    "draft",
  ARCHIVED: "archived",
});

// ─── Attempt lifecycle ────────────────────────────────────────────────────────

/** Lifecycle statuses stored in the `assessment_attempts` table. */
export const ATTEMPT_STATUS = Object.freeze({
  STARTED:   "started",
  SUBMITTED: "submitted",
});

// ─── Question types ───────────────────────────────────────────────────────────

/** Type discriminators stored in the `assessment_questions` table. */
export const QUESTION_TYPE = Object.freeze({
  MCQ:    "MCQ",
  CODING: "Coding",
});

// ─── Grading statuses ─────────────────────────────────────────────────────────

/**
 * Per-answer grading status stored in `assessment_submissions`.
 *
 * GRADED          — automatically scored (MCQ correct/incorrect, or unknown question).
 * PENDING_REVIEW  — submitted but requires human or automated review (Coding).
 * NOT_ATTEMPTED   — student submitted a blank coding answer.
 */
export const GRADING_STATUS = Object.freeze({
  GRADED:         "graded",
  PENDING_REVIEW: "pending_review",
  NOT_ATTEMPTED:  "not_attempted",
});

// ─── Typed business error codes ───────────────────────────────────────────────

/**
 * Structured error codes thrown by the service layer.
 * Controllers pattern-match on `error.code` rather than `error.message`
 * to produce safe, stable HTTP responses without leaking internals.
 */
export const ERROR_CODES = Object.freeze({
  ASSESSMENT_NOT_ACTIVE: "ASSESSMENT_NOT_ACTIVE",
  ASSESSMENT_NOT_FOUND:  "ASSESSMENT_NOT_FOUND",
  ATTEMPT_NOT_FOUND:     "ATTEMPT_NOT_FOUND",
});

// ─── Validation limits ────────────────────────────────────────────────────────

export const VALIDATION = Object.freeze({
  MAX_ANSWERS:          500,
  MAX_ANSWER_TEXT_LEN:  20_000,
  MCQ_OPTION_MIN:       1,
  MCQ_OPTION_MAX:       10,
});

// ─── Generic HTTP response messages ──────────────────────────────────────────

export const HTTP_MESSAGES = Object.freeze({
  INTERNAL_ERROR:        "An unexpected error occurred. Please try again later.",
  UNAUTHORIZED:          "Authentication required.",
  FORBIDDEN:             "You are not authorized to access this resource.",
  ASSESSMENT_NOT_FOUND:  "Assessment not found.",
  RESULT_NOT_FOUND:      "Assessment result not found.",
  ATTEMPT_NOT_FOUND:     "No active assessment attempt found.",
  ASSESSMENT_NOT_ACTIVE: "Assessment is not active.",
});
