import { pool } from "../config/db.js";
import { resolveStudentId } from "../utils/studentAssessmentIdentity.js";
import studentAssessmentService from "../services/studentAssessment.service.js";
import notificationService from "../services/notification.service.js";
import { ensureOptionalAssessmentQuestions } from "../utils/studentAssessmentOptionalAnswers.js";

const isUnanswered = (answer) => {
  if (answer === null || answer === undefined) return true;
  if (typeof answer !== "object") return String(answer).trim() === "";
  if (Object.prototype.hasOwnProperty.call(answer, "optionIndex")) {
    return !Number.isInteger(Number(answer.optionIndex)) || Number(answer.optionIndex) < 0;
  }
  if (Object.prototype.hasOwnProperty.call(answer, "value")) {
    return answer.value === null || answer.value === undefined;
  }
  if (Object.prototype.hasOwnProperty.call(answer, "text")) {
    return String(answer.text ?? "").trim() === "";
  }
  if (Object.prototype.hasOwnProperty.call(answer, "matches")) {
    return !answer.matches || typeof answer.matches !== "object" || Object.keys(answer.matches).length === 0;
  }
  return Object.keys(answer).length === 0;
};

const parsePositiveId = (value, field) => {
  const id = Number(String(value ?? "").replace(/^(?:attempt|assess)_/, ""));
  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error(`${field} must be a positive integer`);
    error.statusCode = 400;
    throw error;
  }
  return id;
};

const handle = async (req, res, next, operation) => {
  try {
    const studentId = await resolveStudentId(req.user);
    const result = await operation(studentId);
    if (result === null) return res.status(404).json({ success: false, message: "Resource not found" });
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

export const listAssessments = (req, res, next) =>
  handle(req, res, next, (studentId) => studentAssessmentService.listAssessments(studentId, req.query?.status || "all"));

export const getAssessment = (req, res, next) =>
  handle(req, res, next, (studentId) => studentAssessmentService.getAssessment(studentId, req.params.assessmentId));

export const startAssessment = (req, res, next) =>
  handle(req, res, next, (studentId) => studentAssessmentService.startAssessment(studentId, req.params.assessmentId));

export const saveAnswer = async (req, res, next) => {
  try {
    const studentId = await resolveStudentId(req.user);
    await ensureOptionalAssessmentQuestions();

    if (!isUnanswered(req.body?.answer)) {
      const result = await studentAssessmentService.saveAnswer(
        studentId,
        req.params.attemptId,
        req.params.questionId,
        req.body?.answer,
      );
      return res.status(200).json({ success: true, data: result });
    }

    // Clearing an answer is a valid student action. Remove the stored response
    // so the question is treated as unanswered on submission.
    const attemptId = parsePositiveId(req.params.attemptId, "attemptId");
    const questionId = parsePositiveId(req.params.questionId, "questionId");
    const cleared = await pool.query(
      `DELETE FROM student_assessment_answers saa
       USING student_assessment_attempts attempt,
             student_assessment_attempt_questions attempt_question
       WHERE saa.attempt_id = attempt.id
         AND saa.attempt_id = $1
         AND attempt.student_id = $2
         AND attempt.status = 'in_progress'
         AND attempt.expires_at > NOW()
         AND attempt_question.attempt_id = attempt.id
         AND attempt_question.question_id = $3
         AND saa.question_id = $3
       RETURNING saa.question_id AS "questionId"`,
      [attemptId, studentId, questionId],
    );

    if (!cleared.rows[0]) {
      return res.status(404).json({ success: false, message: "Assessment attempt or question is no longer active" });
    }

    return res.status(200).json({
      success: true,
      data: {
        saved: false,
        unanswered: true,
        attemptId: `attempt_${attemptId}`,
        questionId,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const recordTabSwitch = (req, res, next) =>
  handle(req, res, next, (studentId) => studentAssessmentService.recordTabSwitch(studentId, req.params.attemptId));

export const submitAssessment = async (req, res, next) => {
  try {
    const studentId = await resolveStudentId(req.user);
    await ensureOptionalAssessmentQuestions();

    const submittedAnswers = Array.isArray(req.body?.answers)
      ? req.body.answers.filter((entry) => entry && !isUnanswered(entry.answer))
      : req.body?.answers;

    const result = await studentAssessmentService.submitAssessment(
      studentId,
      req.params.attemptId,
      req.body?.reason,
      submittedAnswers,
    );
    if (result === null) return res.status(404).json({ success: false, message: "Resource not found" });

    try {
      await notificationService.sendNotificationToStudents({
        studentIds: [studentId],
        title: `Assessment result: ${result.title || "Assessment"}`,
        message: `Your assessment attempt #${result.attemptNumber || 1} scored ${result.percentage ?? 0}%.`,
        type: notificationService.NOTIFICATION_TYPES.GRADE_RELEASED,
        linkUrl: `/student/assessments/${result.assessmentId}/result?attemptId=${result.attemptId}`,
      });
    } catch (notificationError) {
      console.error("[studentAssessment] Failed to dispatch result notification:", notificationError.message);
    }

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

export const getResult = (req, res, next) =>
  handle(req, res, next, (studentId) => studentAssessmentService.getResult(studentId, req.params.attemptId));

export const getReview = (req, res, next) =>
  handle(req, res, next, (studentId) => studentAssessmentService.getReview(studentId, req.params.assessmentId));

export const getHistory = (req, res, next) =>
  handle(req, res, next, (studentId) => studentAssessmentService.getHistory(studentId));
