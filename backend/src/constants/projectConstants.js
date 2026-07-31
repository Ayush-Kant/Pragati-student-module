<<<<<<< HEAD
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
=======
export const PROJECT_STATUS = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  ARCHIVED: "ARCHIVED",
  ON_HOLD: "ON_HOLD",
};

export const PROJECT_ROLE = {
  LEADER: "LEADER",
  MEMBER: "MEMBER",
  MENTOR: "MENTOR",
  CONTRIBUTOR: "CONTRIBUTOR",
>>>>>>> b58e0407 (feat: projects backend implementation)
};

export const MILESTONE_STATUS = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
<<<<<<< HEAD
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
=======
  COMPLETED: "COMPLETED",
  OVERDUE: "OVERDUE",
};

export const TASK_STATUS = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  IN_REVIEW: "IN_REVIEW",
  COMPLETED: "COMPLETED",
  BLOCKED: "BLOCKED",
};

export const TASK_PRIORITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
};

export const SUBMISSION_STATUS = {
  SUBMITTED: "SUBMITTED",
  UNDER_REVIEW: "UNDER_REVIEW",
  ACCEPTED: "ACCEPTED",
  NEEDS_REVISION: "NEEDS_REVISION",
  REJECTED: "REJECTED",
};

export const ACTIVITY_TYPE = {
  PROJECT_CREATED: "PROJECT_CREATED",
  PROJECT_UPDATED: "PROJECT_UPDATED",
  MEMBER_ADDED: "MEMBER_ADDED",
  MEMBER_REMOVED: "MEMBER_REMOVED",
  MILESTONE_CREATED: "MILESTONE_CREATED",
  MILESTONE_UPDATED: "MILESTONE_UPDATED",
  TASK_CREATED: "TASK_CREATED",
  TASK_UPDATED: "TASK_UPDATED",
  SUBMISSION_CREATED: "SUBMISSION_CREATED",
  FILE_UPLOADED: "FILE_UPLOADED",
  FILE_DELETED: "FILE_DELETED",
  REVIEW_ADDED: "REVIEW_ADDED",
};

export const MESSAGES = {
  PROJECT_CREATED: "Project created successfully",
  PROJECT_UPDATED: "Project updated successfully",
  PROJECT_DELETED: "Project deleted successfully",
  PROJECT_NOT_FOUND: "Project not found",
  MILESTONE_CREATED: "Milestone created successfully",
  MILESTONE_UPDATED: "Milestone updated successfully",
  MILESTONE_NOT_FOUND: "Milestone not found",
  TASK_CREATED: "Task created successfully",
  TASK_UPDATED: "Task updated successfully",
  TASK_NOT_FOUND: "Task not found",
  SUBMISSION_SUCCESS: "Project submitted successfully",
  SUBMISSION_NOT_FOUND: "Submission not found",
  FILE_UPLOADED: "File uploaded successfully",
  FILE_DELETED: "File deleted successfully",
  FILE_NOT_FOUND: "File not found",
  INVALID_GITHUB_URL: "Invalid GitHub repository URL",
  UNAUTHORIZED_ACCESS: "Unauthorized access to project",
};
>>>>>>> b58e0407 (feat: projects backend implementation)
