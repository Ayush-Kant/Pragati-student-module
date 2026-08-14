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
};

export const MILESTONE_STATUS = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
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
  PROJECT_ARCHIVED: "PROJECT_ARCHIVED",
  MEMBER_ADDED: "MEMBER_ADDED",
  MEMBER_REMOVED: "MEMBER_REMOVED",
  MEMBER_UPDATED: "MEMBER_UPDATED",
  MILESTONE_CREATED: "MILESTONE_CREATED",
  MILESTONE_UPDATED: "MILESTONE_UPDATED",
  MILESTONE_DELETED: "MILESTONE_DELETED",
  TASK_CREATED: "TASK_CREATED",
  TASK_UPDATED: "TASK_UPDATED",
  TASK_DELETED: "TASK_DELETED",
  SUBMISSION_CREATED: "SUBMISSION_CREATED",
  SUBMISSION_UPDATED: "SUBMISSION_UPDATED",
  FILE_UPLOADED: "FILE_UPLOADED",
  FILE_DELETED: "FILE_DELETED",
  REVIEW_ADDED: "REVIEW_ADDED",
  REVIEW_UPDATED: "REVIEW_UPDATED",
  REPOSITORY_UPDATED: "REPOSITORY_UPDATED",
};

export const MESSAGES = {
  PROJECT_CREATED: "Project created successfully",
  PROJECT_UPDATED: "Project updated successfully",
  PROJECT_ARCHIVED: "Project archived successfully",
  PROJECT_DELETED: "Project deleted successfully",
  PROJECT_NOT_FOUND: "Project not found",
  MEMBER_ADDED: "Team member added successfully",
  MEMBER_REMOVED: "Team member removed successfully",
  MEMBER_UPDATED: "Team member role updated successfully",
  MEMBER_NOT_FOUND: "Team member not found",
  MILESTONE_CREATED: "Milestone created successfully",
  MILESTONE_UPDATED: "Milestone updated successfully",
  MILESTONE_DELETED: "Milestone deleted successfully",
  MILESTONE_NOT_FOUND: "Milestone not found",
  TASK_CREATED: "Task created successfully",
  TASK_UPDATED: "Task updated successfully",
  TASK_DELETED: "Task deleted successfully",
  TASK_NOT_FOUND: "Task not found",
  SUBMISSION_SUCCESS: "Project submitted successfully",
  SUBMISSION_UPDATED: "Submission updated successfully",
  SUBMISSION_NOT_FOUND: "Submission not found",
  FILE_UPLOADED: "File uploaded successfully",
  FILE_DELETED: "File deleted successfully",
  FILE_NOT_FOUND: "File not found",
  REVIEW_ADDED: "Mentor review saved successfully",
  REVIEW_UPDATED: "Mentor evaluation updated successfully",
  REVIEW_NOT_FOUND: "Mentor review not found",
  REPOSITORY_UPDATED: "GitHub repository updated successfully",
  INVALID_GITHUB_URL: "Invalid GitHub repository URL",
  UNAUTHORIZED_ACCESS: "Unauthorized access to project",
};
