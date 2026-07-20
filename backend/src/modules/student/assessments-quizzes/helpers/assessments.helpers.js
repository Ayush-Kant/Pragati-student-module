/**
 * assessments.helpers.js
 *
 * Pure utility functions for grading and timing logic.
 * No I/O — no side effects — safe to unit-test in isolation.
 *
 * Exported surface:
 *   scoreMCQ()            — auto-grade a multiple-choice answer
 *   scoreCoding()         — assign pending/not-attempted status for free-form code
 *   gradeAnswer()         — dispatcher: routes to the correct scorer by type
 *   isTimeLimitExceeded() — boolean timer check (server-side, client-uncontrollable)
 */

import { QUESTION_TYPE, GRADING_STATUS } from "../constants/assessments.constants.js";

// ─── Grading helpers ──────────────────────────────────────────────────────────

/**
 * Score a multiple-choice answer.
 * Awards full marks only when selected_option matches the stored correct_option.
 * Comparison is string-normalised to tolerate integer vs. string DB types.
 *
 * @param {{ correct_option: string|number, marks: number }} question
 * @param {{ selected_option: string|number }}               answer
 * @returns {{ isCorrect: boolean, marksObtained: number, gradingStatus: string }}
 */
export const scoreMCQ = (question, answer) => {
  const isCorrect =
    String(question.correct_option) === String(answer.selected_option);
  return {
    isCorrect,
    marksObtained: isCorrect ? Number(question.marks) : 0,
    gradingStatus: GRADING_STATUS.GRADED,
  };
};

/**
 * Score a coding answer.
 *
 * Automatic grading is NOT available for free-form code submissions.
 * Awards ZERO marks regardless of content and sets PENDING_REVIEW so a human
 * reviewer or future test-runner can assign the actual score.
 *
 * ⚠  Awarding marks solely because answer_text is non-empty would be
 *    exploitable — a one-character submission would receive full marks.
 *
 * @param {{ marks: number }}       question  (marks field kept for API parity)
 * @param {{ answer_text: string }} answer
 * @returns {{ isCorrect: boolean, marksObtained: number, gradingStatus: string }}
 */
export const scoreCoding = (_question, answer) => {
  const hasSubmission = Boolean(
    answer.answer_text && String(answer.answer_text).trim()
  );
  return {
    isCorrect:     false,                  // cannot determine without code execution
    marksObtained: 0,                      // zero until reviewer/test-runner scores it
    gradingStatus: hasSubmission
      ? GRADING_STATUS.PENDING_REVIEW
      : GRADING_STATUS.NOT_ATTEMPTED,
  };
};

/**
 * Dispatch grading to the correct scorer based on question.type.
 *
 * Falls back to zero marks + GRADED status for:
 *   • null / undefined question (question_id not in this assessment)
 *   • unknown / future question types
 *
 * @param {object|null} question — Row from getQuestionsForGrading (with assessment_id filter)
 * @param {object}      answer   — Validated answer from the submission payload
 * @returns {{ isCorrect: boolean, marksObtained: number, gradingStatus: string }}
 */
export const gradeAnswer = (question, answer) => {
  if (!question) {
    // question_id submitted by the student did not belong to this assessment.
    return { isCorrect: false, marksObtained: 0, gradingStatus: GRADING_STATUS.GRADED };
  }

  switch (question.type) {
    case QUESTION_TYPE.MCQ:
      return scoreMCQ(question, answer);
    case QUESTION_TYPE.CODING:
      return scoreCoding(question, answer);
    default:
      return { isCorrect: false, marksObtained: 0, gradingStatus: GRADING_STATUS.GRADED };
  }
};

// ─── Timer helpers ────────────────────────────────────────────────────────────

/**
 * Returns true if the student's allowed time window has already elapsed.
 *
 * Uses server-side `Date.now()` — not client-supplied time — so students
 * cannot manipulate the clock to bypass the timer.
 *
 * Callers are expected to have already confirmed timeLimitMinutes is a positive
 * finite number before invoking this function. Passing a non-finite value will
 * throw rather than silently returning false (which would bypass the timer).
 *
 * @param {string|Date} startedAt        — When the attempt was started (DB timestamp)
 * @param {number}      timeLimitMinutes — Assessment time limit in minutes (> 0, finite)
 * @returns {boolean}
 * @throws {TypeError} if timeLimitMinutes is not a positive finite number
 */
export const isTimeLimitExceeded = (startedAt, timeLimitMinutes) => {
  if (!Number.isFinite(timeLimitMinutes) || timeLimitMinutes <= 0) {
    throw new TypeError(
      `isTimeLimitExceeded: timeLimitMinutes must be a positive finite number, got ${timeLimitMinutes}`
    );
  }
  const elapsedMs = Date.now() - new Date(startedAt).getTime();
  return elapsedMs > timeLimitMinutes * 60 * 1_000;
};

