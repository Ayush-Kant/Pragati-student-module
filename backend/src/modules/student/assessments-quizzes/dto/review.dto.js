/**
 * review.dto.js
 *
 * Shapes assessment result data for student-facing API responses.
 *
 * Fields intentionally omitted:
 *   student_id  — redundant; already known by the authenticated client
 *   created_at  — internal metadata
 *   updated_at  — internal metadata
 *
 * Note: this DTO will only ever receive SUBMITTED attempt rows because the
 * repository's getResult restricts to status = 'submitted'.
 */

/**
 * Maps a submitted attempt row to the student-facing result shape.
 * Converts snake_case DB fields to camelCase.
 *
 * @param {object} attempt — Raw SUBMITTED attempt row from getResult
 * @returns {object}
 */
export const toResultDTO = (attempt) => ({
  id:           attempt.id,
  assessmentId: attempt.assessment_id,
  startedAt:    attempt.started_at,
  submittedAt:  attempt.submitted_at,
  score:        attempt.score,
  status:       attempt.status,
});
