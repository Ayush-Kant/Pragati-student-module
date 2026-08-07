/**
 * Project Module Constants & Enums
 */

export const PROJECT_STATUS = {
  ALL: 'all',
  NOT_STARTED: 'not-started',
  IN_PROGRESS: 'in-progress',
  NEEDS_REVISION: 'needs-revision',
  UNDER_REVIEW: 'under-review',
  COMPLETED: 'completed',
  OVERDUE: 'overdue',
};

export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  DONE: 'done',
};

export const SUBMISSION_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  NEEDS_REVISION: 'needs-revision',
};

export const REVIEW_STATUS = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  NEEDS_REVISION: 'needs-revision',
};

export const MODULE_ROUTES = {
  PROJECTS: '/student/projects',
  PROJECT_DETAILS: (id) => `/student/projects/${id}`,
  PROJECT_SUBMISSION: (id) => `/student/projects/${id}/submit`,
  PROJECT_PROGRESS: (id) => `/student/projects/${id}/progress`,
};

export const FILE_UPLOAD_CONSTRAINTS = {
  MAX_FILE_SIZE_MB: 25,
  ALLOWED_EXTENSIONS: ['.zip', '.pdf', '.docx', '.pptx', '.png', '.jpg', '.jpeg', '.json'],
  ALLOWED_MIME_TYPES: [
    'application/zip',
    'application/x-zip-compressed',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/png',
    'image/jpeg',
    'application/json',
  ],
};
