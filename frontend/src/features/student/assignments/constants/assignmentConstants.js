// Assignment Status
export const ASSIGNMENT_STATUS = {
  PENDING: "Pending",
  COMPLETED: "Completed",
};

// Submission Status
export const SUBMISSION_STATUS = {
  NOT_SUBMITTED: "Not Submitted",
  SUBMITTED: "Submitted",
  LATE: "Late",
};

// Filter Options
export const FILTERS = {
  ALL: "All",
  PENDING: "Pending",
  COMPLETED: "Completed",
};

// File Upload Configuration
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/zip",
];

// Success Messages
export const SUCCESS_MESSAGES = {
  SUBMISSION_SUCCESS: "Assignment submitted successfully.",
  SUBMISSION_UPDATED: "Submission updated successfully.",
};

// Error Messages
export const ERROR_MESSAGES = {
  FETCH_ASSIGNMENTS: "Failed to load assignments.",
  REQUIRED_FIELDS: "Please fill all required fields.",
  INVALID_FILE: "Invalid file type.",
  FILE_TOO_LARGE: "File size exceeds 10 MB.",
  SUBMISSION_FAILED: "Failed to submit assignment.",
  SOMETHING_WENT_WRONG: "Something went wrong.",
};