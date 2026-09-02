import { resolveStudentId } from "../utils/studentAssessmentIdentity.js";
import studentAssessmentService from "../services/studentAssessment.service.js";

const handle = async (req, res, next, operation) => {
  try {
    const studentId = await resolveStudentId(req.user);
    const result = await operation(studentId);
    if (result === null) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

export const listAssessments = (req, res, next) =>
  handle(req, res, next, (studentId) => studentAssessmentService.listAssessments(studentId));

export const getAssessment = (req, res, next) =>
  handle(req, res, next, (studentId) =>
    studentAssessmentService.getAssessment(studentId, req.params.assessmentId),
  );

export const startAssessment = (req, res, next) =>
  handle(req, res, next, (studentId) =>
    studentAssessmentService.startAssessment(studentId, req.params.assessmentId),
  );

export const saveAnswer = (req, res, next) =>
  handle(req, res, next, (studentId) =>
    studentAssessmentService.saveAnswer(
      studentId,
      req.params.attemptId,
      req.params.questionId,
      req.body?.answer,
    ),
  );

export const recordTabSwitch = (req, res, next) =>
  handle(req, res, next, (studentId) =>
    studentAssessmentService.recordTabSwitch(studentId, req.params.attemptId),
  );

export const submitAssessment = (req, res, next) =>
  handle(req, res, next, (studentId) =>
    studentAssessmentService.submitAssessment(studentId, req.params.attemptId, req.body?.reason),
  );

export const getResult = (req, res, next) =>
  handle(req, res, next, (studentId) =>
    studentAssessmentService.getResult(studentId, req.params.attemptId),
  );

export const getHistory = (req, res, next) =>
  handle(req, res, next, (studentId) => studentAssessmentService.getHistory(studentId));
