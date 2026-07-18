/**
 * quiz.dto.js
 *
 * Shapes assessment and question data for student-facing API responses.
 *
 * Fields intentionally excluded from ALL outputs:
 *   correct_option   — must NEVER be sent to students (before OR after submission)
 *   assessment_id    — excluded from questions (internal join key, redundant to client)
 *   hidden_test_cases — internal test harness data, never for student consumption
 *   created_at       — internal metadata on questions
 *   updated_at       — internal metadata
 *   student_id       — never relevant in assessment context
 *   created_by       — admin field
 *   published_at     — admin field
 *   archived_at      — admin field
 */

/**
 * Maps a single question row to a student-safe shape.
 * Not exported — consumed only by toAssessmentDetailDTO.
 *
 * @param {object} question — Raw row from getAssessmentQuestions (correct_option excluded at SQL level)
 * @returns {object}
 */
const toQuestionDTO = (question) => ({
  id:               question.id,
  type:             question.type,
  questionText:     question.question_text,
  options:          question.options,
  problemStatement: question.problem_statement,
  languageSupport:  question.language_support,
  sampleInput:      question.sample_input,
  sampleOutput:     question.sample_output,
  marks:            question.marks,
  // assessment_id deliberately excluded — client knows which assessment it queried
  // correct_option excluded at the SQL layer — never reaches here
});

/**
 * Maps a raw assessment row to a lean summary suitable for list views.
 * Converts snake_case DB fields to camelCase.
 *
 * @param {object} row — Raw row from getAssignedAssessments
 * @returns {object}
 */
export const toAssessmentListItemDTO = (row) => ({
  id:               row.id,
  title:            row.title,
  type:             row.type,
  difficulty:       row.difficulty,
  timeLimitMinutes: row.time_limit_minutes,
  totalMarks:       row.total_marks,
  status:           row.status,
  createdAt:        row.created_at,
});

/**
 * Maps a raw assessment row + questions array to the full detail shape.
 * Questions are individually mapped through toQuestionDTO.
 *
 * @param {object} assessment — { ...assessmentRow, questions: [] }
 * @returns {object}
 */
export const toAssessmentDetailDTO = (assessment) => ({
  id:               assessment.id,
  title:            assessment.title,
  type:             assessment.type,
  difficulty:       assessment.difficulty,
  timeLimitMinutes: assessment.time_limit_minutes,
  totalMarks:       assessment.total_marks,
  status:           assessment.status,
  createdAt:        assessment.created_at,
  questions:        (assessment.questions ?? []).map(toQuestionDTO),
});
