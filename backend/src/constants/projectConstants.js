// ─────────────────────────────────────────────────────────────────────────────
//  src/constants/projectConstants.js
//  Constants for Projects Backend Module
// ─────────────────────────────────────────────────────────────────────────────

export const PROJECT_STATUS = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  SUBMITTED: "SUBMITTED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

export const MILESTONE_STATUS = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  SUBMITTED: "SUBMITTED",
  COMPLETED: "COMPLETED",
};

export const SUBMISSION_STATUS = {
  PENDING: "PENDING",
  SUBMITTED: "SUBMITTED",
  REJECTED: "REJECTED",
  APPROVED: "APPROVED",
};

export const SUBMISSION_TYPE = {
  MILESTONE: "MILESTONE",
  FINAL: "FINAL",
};

export const FILE_CONSTRAINTS = {
  MAX_REPORT_SIZE: 20 * 1024 * 1024, // 20 MB in bytes
  ALLOWED_MIME: "application/pdf",
  ALLOWED_EXT: ".pdf",
};

export const VALIDATION_LIMITS = {
  MAX_PROGRESS_NOTES_LENGTH: 1000,
};

export const GITHUB_URL_PREFIX = "https://github.com/";
export const DEPLOYMENT_URL_PREFIX = "https://";
