/**
 * attempt.dto.js
 *
 * Shapes attempt-related data for student-facing API responses.
 *
 * Fields intentionally omitted:
 *   student_id   — redundant; authenticated student already knows their ID
 *   score        — not meaningful at attempt-start time
 *   submitted_at — null / irrelevant at attempt-start time
 *   created_at   — internal metadata
 *   updated_at   — internal metadata
 */

/**
 * Maps a newly created or resumed attempt row to the start-attempt response.
 *
 * @param {object} attempt — Raw attempt row from createAttempt / getActiveAttempt
 * @returns {object}
 */
export const toAttemptStartDTO = (attempt) => ({
  id:           attempt.id,
  assessmentId: attempt.assessment_id,
  startedAt:    attempt.started_at,
  status:       attempt.status,
});

/**
 * Maps the service-level submission result to the API response shape.
 * The service returns { message } — the DTO prevents the service from
 * ever hardcoding raw response shapes.
 *
 * @param {{ message: string }} result
 * @returns {object}
 */
export const toSubmitResponseDTO = (result) => ({
  message: result.message,
});
