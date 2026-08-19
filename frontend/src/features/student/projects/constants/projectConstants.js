/**
 * Central constants for the Advanced Project Workspace feature (MOD-07).
 * Keep all magic strings, colour maps, and static configuration here so
 * components never hardcode values.
 */

// ─── Project Status ────────────────────────────────────────────────────────────

/** @enum {string} Lifecycle status of a student project. */
export const PROJECT_STATUS = {
  NOT_STARTED:  'Not Started',
  IN_PROGRESS:  'In Progress',
  SUBMITTED:    'Submitted',
  UNDER_REVIEW: 'Under Review',
  EVALUATED:    'Evaluated',
  COMPLETED:    'Completed',
  OVERDUE:      'Overdue',
};

/**
 * Tailwind badge classes per project status.
 * @type {Record<string, string>}
 */
export const PROJECT_STATUS_COLORS = {
  [PROJECT_STATUS.NOT_STARTED]:
    'bg-gray-700/20 text-gray-400 border border-gray-700/40',
  [PROJECT_STATUS.IN_PROGRESS]:
    'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  [PROJECT_STATUS.SUBMITTED]:
    'bg-violet-500/15 text-violet-400 border border-violet-500/30',
  [PROJECT_STATUS.UNDER_REVIEW]:
    'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  [PROJECT_STATUS.EVALUATED]:
    'bg-teal-500/15 text-teal-400 border border-teal-500/30',
  [PROJECT_STATUS.COMPLETED]:
    'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  [PROJECT_STATUS.OVERDUE]:
    'bg-red-500/15 text-red-400 border border-red-500/30',
};

/**
 * Dot / indicator colour per project status.
 * @type {Record<string, string>}
 */
export const PROJECT_STATUS_DOT = {
  [PROJECT_STATUS.NOT_STARTED]:  'bg-gray-500',
  [PROJECT_STATUS.IN_PROGRESS]:  'bg-blue-400',
  [PROJECT_STATUS.SUBMITTED]:    'bg-violet-400',
  [PROJECT_STATUS.UNDER_REVIEW]: 'bg-yellow-400',
  [PROJECT_STATUS.EVALUATED]:    'bg-teal-400',
  [PROJECT_STATUS.COMPLETED]:    'bg-emerald-400',
  [PROJECT_STATUS.OVERDUE]:      'bg-red-400',
};

// ─── Milestone Status ──────────────────────────────────────────────────────────

/** @enum {string} Lifecycle status of a single milestone. */
export const MILESTONE_STATUS = {
  PENDING:     'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED:   'Completed',
  BLOCKED:     'Blocked',
  OVERDUE:     'Overdue',
};

/**
 * Tailwind badge classes per milestone status.
 * @type {Record<string, string>}
 */
export const MILESTONE_STATUS_COLORS = {
  [MILESTONE_STATUS.PENDING]:
    'bg-gray-700/20 text-gray-400 border border-gray-700/40',
  [MILESTONE_STATUS.IN_PROGRESS]:
    'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  [MILESTONE_STATUS.COMPLETED]:
    'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  [MILESTONE_STATUS.BLOCKED]:
    'bg-orange-500/15 text-orange-400 border border-orange-500/30',
  [MILESTONE_STATUS.OVERDUE]:
    'bg-red-500/15 text-red-400 border border-red-500/30',
};

/**
 * Timeline connector/node colour per milestone status.
 * @type {Record<string, string>}
 */
export const MILESTONE_NODE_COLORS = {
  [MILESTONE_STATUS.PENDING]:     'border-gray-600 bg-gray-800',
  [MILESTONE_STATUS.IN_PROGRESS]: 'border-blue-500 bg-blue-500/20',
  [MILESTONE_STATUS.COMPLETED]:   'border-emerald-500 bg-emerald-500/20',
  [MILESTONE_STATUS.BLOCKED]:     'border-orange-500 bg-orange-500/20',
  [MILESTONE_STATUS.OVERDUE]:     'border-red-500 bg-red-500/20',
};

// ─── Submission Workflow States ────────────────────────────────────────────────

/** @enum {string} Fine-grained state machine states for submission. */
export const SUBMISSION_STATE = {
  DRAFT:       'draft',
  VALIDATING:  'validating',
  UPLOADING:   'uploading',
  READY:       'ready',
  SUBMITTING:  'submitting',
  SUBMITTED:   'submitted',
  UNDER_REVIEW:'under_review',
  EVALUATED:   'evaluated',
};

// ─── Upload State ──────────────────────────────────────────────────────────────

/** @enum {string} Per-file upload states. */
export const UPLOAD_STATE = {
  IDLE:       'idle',
  UPLOADING:  'uploading',
  SUCCESS:    'success',
  ERROR:      'error',
  CANCELLED:  'cancelled',
};

// ─── File Constraints ──────────────────────────────────────────────────────────

/** Max total upload size in bytes (50 MB). */
export const MAX_TOTAL_UPLOAD_BYTES = 50 * 1024 * 1024;

/** Max individual file size in bytes (25 MB). */
export const MAX_FILE_BYTES = 25 * 1024 * 1024;

/** Accepted MIME types for project file attachments. */
export const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/zip',
  'application/x-zip-compressed',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'text/plain',
  'text/markdown',
];

/** Allowed extension labels shown in UI hint. */
export const ACCEPTED_EXTENSIONS = '.pdf, .zip, .docx, .png, .jpg, .gif, .webp, .txt, .md';

// ─── Evaluation ────────────────────────────────────────────────────────────────

/** Grade boundaries (inclusive lower bound). */
export const GRADE_BOUNDARIES = [
  { min: 90, grade: 'A+', label: 'Outstanding' },
  { min: 80, grade: 'A',  label: 'Excellent'   },
  { min: 70, grade: 'B',  label: 'Good'         },
  { min: 60, grade: 'C',  label: 'Satisfactory' },
  { min: 50, grade: 'D',  label: 'Needs Work'   },
  { min: 0,  grade: 'F',  label: 'Fail'         },
];

// ─── Project Detail Tabs ───────────────────────────────────────────────────────

/** Ordered list of tab identifiers for the project detail view. */
export const DETAIL_TABS = [
  { id: 'overview',    label: 'Overview'     },
  { id: 'requirements',label: 'Requirements' },
  { id: 'milestones',  label: 'Milestones'   },
  { id: 'submission',  label: 'Submission'   },
  { id: 'evaluation',  label: 'Evaluation'   },
];

// ─── Filter Options ────────────────────────────────────────────────────────────

/** Status filter options for the dashboard. */
export const STATUS_FILTER_OPTIONS = [
  'All',
  ...Object.values(PROJECT_STATUS),
];

// ─── Mock Delay ────────────────────────────────────────────────────────────────

/** Simulated network latency in milliseconds. */
export const MOCK_DELAY_MS = 600;
