import { APPLICATION_STATUS, INTERVIEW_STATUS, ERROR_CODES } from "../constants/placementConstants.js";
import { formatErrorResponse } from "../utils/placementHelpers.js";

export const validateApplication = (req, res, next) => {
  const { companyName, jobTitle } = req.body || {};

  if (!companyName || typeof companyName !== "string" || companyName.trim() === "") {
    return res
      .status(400)
      .json(formatErrorResponse("companyName is required and must be a non-empty string", ERROR_CODES.VALIDATION_ERROR));
  }

  if (!jobTitle || typeof jobTitle !== "string" || jobTitle.trim() === "") {
    return res
      .status(400)
      .json(formatErrorResponse("jobTitle is required and must be a non-empty string", ERROR_CODES.VALIDATION_ERROR));
  }

  if (req.body.status && !Object.values(APPLICATION_STATUS).includes(req.body.status)) {
    return res
      .status(400)
      .json(formatErrorResponse(`Invalid application status: ${req.body.status}`, ERROR_CODES.VALIDATION_ERROR));
  }

  next();
};

export const validateApplicationStatus = (req, res, next) => {
  const { status } = req.body || {};

  if (!status || !Object.values(APPLICATION_STATUS).includes(status)) {
    return res
      .status(400)
      .json(formatErrorResponse(`Invalid or missing application status: ${status}`, ERROR_CODES.VALIDATION_ERROR));
  }

  next();
};

export const validateInterview = (req, res, next) => {
  const { companyName, dateTime } = req.body || {};

  if (!companyName || typeof companyName !== "string" || companyName.trim() === "") {
    return res
      .status(400)
      .json(formatErrorResponse("companyName is required and must be a non-empty string", ERROR_CODES.VALIDATION_ERROR));
  }

  if (!dateTime || isNaN(Date.parse(dateTime))) {
    return res
      .status(400)
      .json(formatErrorResponse("dateTime is required and must be a valid date", ERROR_CODES.VALIDATION_ERROR));
  }

  if (req.body.status && !Object.values(INTERVIEW_STATUS).includes(req.body.status)) {
    return res
      .status(400)
      .json(formatErrorResponse(`Invalid interview status: ${req.body.status}`, ERROR_CODES.VALIDATION_ERROR));
  }

  next();
};

export const validateInterviewStatus = (req, res, next) => {
  const { status } = req.body || {};

  if (!status || !Object.values(INTERVIEW_STATUS).includes(status)) {
    return res
      .status(400)
      .json(formatErrorResponse(`Invalid or missing interview status: ${status}`, ERROR_CODES.VALIDATION_ERROR));
  }

  next();
};

export const validateSkillData = (req, res, next) => {
  const { skillName, currentScore } = req.body || {};

  if (!skillName || typeof skillName !== "string" || skillName.trim() === "") {
    return res
      .status(400)
      .json(formatErrorResponse("skillName is required", ERROR_CODES.VALIDATION_ERROR));
  }

  if (currentScore !== undefined && (typeof currentScore !== "number" || currentScore < 0 || currentScore > 100)) {
    return res
      .status(400)
      .json(formatErrorResponse("currentScore must be a number between 0 and 100", ERROR_CODES.VALIDATION_ERROR));
  }

  next();
};

export const validateDateRange = (req, res, next) => {
  const { startDate, endDate } = req.query || {};

  if (startDate && isNaN(Date.parse(startDate))) {
    return res
      .status(400)
      .json(formatErrorResponse("Invalid startDate format", ERROR_CODES.VALIDATION_ERROR));
  }

  if (endDate && isNaN(Date.parse(endDate))) {
    return res
      .status(400)
      .json(formatErrorResponse("Invalid endDate format", ERROR_CODES.VALIDATION_ERROR));
  }

  next();
};

export const validateApplicationOwnership = (req, res, next) => {
  const applicationId = Number(req.params.applicationId);
  if (!applicationId || isNaN(applicationId) || applicationId <= 0) {
    return res
      .status(400)
      .json(formatErrorResponse("Invalid applicationId parameter", ERROR_CODES.VALIDATION_ERROR));
  }
  next();
};

export const validateInterviewOwnership = (req, res, next) => {
  const interviewId = Number(req.params.interviewId);
  if (!interviewId || isNaN(interviewId) || interviewId <= 0) {
    return res
      .status(400)
      .json(formatErrorResponse("Invalid interviewId parameter", ERROR_CODES.VALIDATION_ERROR));
  }
  next();
};

export default {
  validateApplication,
  validateApplicationStatus,
  validateInterview,
  validateInterviewStatus,
  validateSkillData,
  validateDateRange,
  validateApplicationOwnership,
  validateInterviewOwnership,
};
