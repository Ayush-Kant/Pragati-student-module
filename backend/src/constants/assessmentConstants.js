/**
 * Central place for enums, status values, and reusable messages
 * used across the Assessments module.
 */

export const ATTEMPT_STATUS = {
  IN_PROGRESS: "in_progress",
  SUBMITTED: "submitted",
  EXPIRED: "expired",
};

export const ASSESSMENT_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
};

export const QUESTION_TYPE = {
  SINGLE_CHOICE: "single_choice",
  MULTIPLE_CHOICE: "multiple_choice",
  TRUE_FALSE: "true_false",
};

export const RESULT_STATUS = {
  PASSED: "passed",
  FAILED: "failed",
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const MESSAGES = {
  ASSESSMENTS_FETCHED: "Assessments retrieved successfully.",
  ASSESSMENT_DETAILS_FETCHED: "Assessment details retrieved successfully.",
  ASSESSMENT_NOT_FOUND: "Assessment not found.",
  ASSESSMENT_NOT_PUBLISHED: "This assessment is not currently available.",
  ATTEMPT_STARTED: "Assessment attempt started successfully.",
  ATTEMPT_ALREADY_IN_PROGRESS: "An attempt for this assessment is already in progress.",
  ATTEMPT_NOT_FOUND: "Assessment attempt not found.",
  ATTEMPT_ALREADY_SUBMITTED: "This assessment attempt has already been submitted.",
  SUBMISSION_SUCCESS: "Assessment submitted successfully.",
  RESULT_FETCHED: "Assessment result retrieved successfully.",
  RESULT_NOT_FOUND: "Result not found for this assessment.",
  HISTORY_FETCHED: "Assessment history retrieved successfully.",
  INVALID_TOKEN: "Invalid or expired authentication token.",
  NO_TOKEN: "Authentication token is required.",
  VALIDATION_ERROR: "Validation failed.",
  SERVER_ERROR: "Something went wrong. Please try again later.",
  INVALID_ANSWERS: "Submitted answers are invalid.",
};

export const DEFAULT_PASS_PERCENTAGE = 40;
