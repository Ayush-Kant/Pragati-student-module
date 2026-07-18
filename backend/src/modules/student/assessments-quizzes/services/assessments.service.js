/**
 * assessments.service.js
 *
 * Contains ONLY business logic for the student assessments-quizzes module.
 * No SQL here — all DB access is delegated to assessments.repository.js.
 * No DTO construction here — that is the controller's responsibility.
 *
 * Throws structured errors with `error.code` set to one of ERROR_CODES so
 * the controller can produce stable, safe HTTP responses without matching on
 * raw error.message strings.
 */

import * as AssessmentsRepository from "../repositories/assessments.repository.js";
import { ASSESSMENT_STATUS, ERROR_CODES } from "../constants/assessments.constants.js";
import { gradeAnswer } from "../helpers/assessments.helpers.js";

// ─── Typed business error factory ────────────────────────────────────────────

/**
 * Create a structured business error that carries a code the controller can
 * safely match on without touching the message string.
 *
 * @param {string} code    — One of ERROR_CODES
 * @param {string} message — Developer-facing message (NEVER sent to the client)
 */
const businessError = (code, message) => {
  const err = new Error(message);
  err.code = code;
  return err;
};

// ─── Service class ────────────────────────────────────────────────────────────

class StudentAssessmentService {

  /**
   * Return every active assessment assigned to the student's recruitment drive.
   * The repository query is drive-scoped — students only see their own assessments.
   *
   * @param {number} studentId
   * @returns {Promise<object[]>}
   */
  async getAssignedAssessments(studentId) {
    return AssessmentsRepository.getAssignedAssessments(studentId);
  }

  /**
   * Return a single assessment with its questions for a student to view.
   *
   * Both DB calls are dispatched concurrently with Promise.all — eliminates the
   * serial latency of the previous sequential await pattern.
   *
   * @param {number} assessmentId — already validated by ensureAssessmentAssigned
   * @returns {Promise<object|null>}
   */
  async getAssessmentDetails(assessmentId) {
    const [assessment, questions] = await Promise.all([
      AssessmentsRepository.getAssessmentById(assessmentId),
      AssessmentsRepository.getAssessmentQuestions(assessmentId),
    ]);

    if (!assessment) return null;

    return { ...assessment, questions };
  }

  /**
   * Start or resume a STARTED attempt for a student.
   *
   * Business rules:
   *  1. Assessment must exist and be ACTIVE.
   *  2. If a STARTED attempt already exists, return it (idempotent).
   *  3. Otherwise, create a new attempt using INSERT ON CONFLICT to prevent
   *     duplicate rows under concurrent /start requests.
   *
   * The authorization middleware already verified drive membership and that the
   * assessment is active. The status check here is defense-in-depth in case the
   * assessment is deactivated between the middleware check and this call.
   *
   * @param {number} studentId
   * @param {number} assessmentId
   * @returns {Promise<object>}
   */
  async startAttempt(studentId, assessmentId) {
    const assessment = await AssessmentsRepository.getAssessmentById(assessmentId);

    if (!assessment) {
      throw businessError(ERROR_CODES.ASSESSMENT_NOT_FOUND, "Assessment not found.");
    }

    if (assessment.status !== ASSESSMENT_STATUS.ACTIVE) {
      throw businessError(ERROR_CODES.ASSESSMENT_NOT_ACTIVE, "Assessment is not active.");
    }

    // Returns existing STARTED attempt or creates one — race-safe via ON CONFLICT.
    return AssessmentsRepository.createAttempt(studentId, assessmentId);
  }

  /**
   * Grade and persist a student's submission.
   *
   * Business rules:
   *  1. An active STARTED attempt must exist (middleware already enforces this,
   *     but the repository double-checks by restricting to STARTED status).
   *  2. Grade every answer using the appropriate scorer (MCQ / Coding).
   *  3. Questions are fetched in one query — no N+1.
   *  4. getQuestionsForGrading scopes to assessmentId — prevents question-ID forgery.
   *  5. submitAnswers runs INSERT + score UPDATE + status UPDATE in one transaction.
   *
   * @param {number}   studentId
   * @param {number}   assessmentId
   * @param {object[]} answers        — validated by Joi, non-empty array
   * @returns {Promise<{ message: string }>}
   */
  async submitAttempt(studentId, assessmentId, answers) {
    // Defense-in-depth: repository restricts to STARTED status.
    const attempt = await AssessmentsRepository.getAttempt(studentId, assessmentId);
    if (!attempt) {
      throw businessError(ERROR_CODES.ATTEMPT_NOT_FOUND, "No active attempt found.");
    }

    // Single bulk query — eliminates N+1 and scopes to this assessment's questions.
    const questionIds = answers.map((a) => Number(a.question_id));
    const questionMap = await AssessmentsRepository.getQuestionsForGrading(
      questionIds,
      assessmentId
    );

    // Grade every answer with the pure helper (no I/O).
    const scoredAnswers = answers.map((answer) => {
      const question = questionMap.get(Number(answer.question_id)) ?? null;
      const { isCorrect, marksObtained, gradingStatus } = gradeAnswer(question, answer);
      return { ...answer, isCorrect, marksObtained, gradingStatus };
    });

    // Bulk INSERT + score recalculation + status transition in one transaction.
    await AssessmentsRepository.submitAnswers(attempt.id, scoredAnswers);

    return { message: "Assessment submitted successfully." };
  }

  /**
   * Fetch the most-recent SUBMITTED attempt result for a student.
   *
   * Only SUBMITTED attempts are returned — students cannot retrieve a null-score
   * in-progress attempt through this endpoint.
   *
   * @param {number} studentId
   * @param {number} assessmentId
   * @returns {Promise<object|null>}
   */
  async getResult(studentId, assessmentId) {
    const attempt = await AssessmentsRepository.getResult(studentId, assessmentId);
    if (!attempt) {
      // No submitted attempt exists — could be not started or still in progress.
      return null;
    }
    return attempt;
  }
}

export default new StudentAssessmentService();
