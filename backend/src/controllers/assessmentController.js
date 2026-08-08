import * as assessmentService from "../services/assessmentService.js";
import { successResponse, errorResponse } from "../utils/assessmentHelpers.js";
import { HTTP_STATUS, MESSAGES } from "../constants/assessmentConstants.js";

/**
 * Wraps a controller handler. Known ServiceErrors (thrown deliberately by
 * the service layer, e.g. "not found", "already submitted") are answered
 * directly here with the module's standardized response shape. Anything
 * unexpected is forwarded via next(err) to the project's global
 * errorMiddleware for logging/handling.
 */
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    if (err instanceof assessmentService.ServiceError) {
      return errorResponse(res, err.statusCode, err.message);
    }
    return next(err);
  }
};

export const getAvailableAssessments = asyncHandler(async (req, res) => {
  const assessments = await assessmentService.getAvailableAssessments();
  return successResponse(res, HTTP_STATUS.OK, MESSAGES.ASSESSMENTS_FETCHED, assessments);
});

export const getAssessmentDetails = asyncHandler(async (req, res) => {
  const { assessmentId } = req.params;
  const assessment = await assessmentService.getAssessmentDetails(assessmentId);
  return successResponse(res, HTTP_STATUS.OK, MESSAGES.ASSESSMENT_DETAILS_FETCHED, assessment);
});

export const startAssessment = asyncHandler(async (req, res) => {
  const { assessmentId } = req.params;
  const studentId = req.user.id;
  const attempt = await assessmentService.startAssessment(assessmentId, studentId);
  return successResponse(res, HTTP_STATUS.CREATED, MESSAGES.ATTEMPT_STARTED, attempt);
});

export const submitAssessment = asyncHandler(async (req, res) => {
  const { assessmentId } = req.params;
  const studentId = req.user.id;
  const result = await assessmentService.submitAssessment(assessmentId, studentId, req.body);
  return successResponse(res, HTTP_STATUS.OK, MESSAGES.SUBMISSION_SUCCESS, result);
});

export const getAssessmentResult = asyncHandler(async (req, res) => {
  const { assessmentId } = req.params;
  const studentId = req.user.id;
  const result = await assessmentService.getAssessmentResult(assessmentId, studentId);
  return successResponse(res, HTTP_STATUS.OK, MESSAGES.RESULT_FETCHED, result);
});

export const getAssessmentHistory = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const { page, limit } = req.query;
  const history = await assessmentService.getAssessmentHistory(studentId, { page, limit });
  return successResponse(res, HTTP_STATUS.OK, MESSAGES.HISTORY_FETCHED, history);
});
