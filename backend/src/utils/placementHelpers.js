import {
  APPLICATION_STATUS,
  ALLOWED_APPLICATION_TRANSITIONS,
  INTERVIEW_STATUS,
  ALLOWED_INTERVIEW_TRANSITIONS,
} from "../constants/placementConstants.js";

export const formatSuccessResponse = (data, message = "Success") => ({
  success: true,
  message,
  data,
});

export const formatErrorResponse = (message, code = "ERROR", details = null) => ({
  success: false,
  message,
  code,
  ...(details ? { details } : {}),
});

export const isValidApplicationTransition = (currentStatus, targetStatus) => {
  if (currentStatus === targetStatus) return true;
  const allowed = ALLOWED_APPLICATION_TRANSITIONS[currentStatus] || [];
  return allowed.includes(targetStatus);
};

export const isValidInterviewTransition = (currentStatus, targetStatus) => {
  if (currentStatus === targetStatus) return true;
  const allowed = ALLOWED_INTERVIEW_TRANSITIONS[currentStatus] || [];
  return allowed.includes(targetStatus);
};

export const sanitizeString = (str) => (typeof str === "string" ? str.trim() : str);

export default {
  formatSuccessResponse,
  formatErrorResponse,
  isValidApplicationTransition,
  isValidInterviewTransition,
  sanitizeString,
};
