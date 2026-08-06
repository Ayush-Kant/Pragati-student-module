/**
 * Project Module Constants & Enums
 */

export const PROJECT_STATUS = {
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  SUBMITTED: "SUBMITTED",
  UNDER_REVIEW: "UNDER_REVIEW",
  APPROVED: "APPROVED",
  COMPLETED: "COMPLETED",
  OVERDUE: "OVERDUE",
};

export const TASK_STATUS = {
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  OVERDUE: "OVERDUE",
};

export const PROJECT_STATUS_CONFIG = {
  [PROJECT_STATUS.NOT_STARTED]: {
    label: "Not Started",
    bgClass: "bg-slate-100 dark:bg-slate-800",
    textClass: "text-slate-700 dark:text-slate-300",
    borderClass: "border-slate-300 dark:border-slate-700",
    dotClass: "bg-slate-500",
  },
  [PROJECT_STATUS.IN_PROGRESS]: {
    label: "In Progress",
    bgClass: "bg-sky-50 dark:bg-sky-950/50",
    textClass: "text-sky-700 dark:text-sky-300",
    borderClass: "border-sky-200 dark:border-sky-800",
    dotClass: "bg-sky-500",
  },
  [PROJECT_STATUS.SUBMITTED]: {
    label: "Submitted",
    bgClass: "bg-purple-50 dark:bg-purple-950/50",
    textClass: "text-purple-700 dark:text-purple-300",
    borderClass: "border-purple-200 dark:border-purple-800",
    dotClass: "bg-purple-500",
  },
  [PROJECT_STATUS.UNDER_REVIEW]: {
    label: "Under Review",
    bgClass: "bg-amber-50 dark:bg-amber-950/50",
    textClass: "text-amber-700 dark:text-amber-300",
    borderClass: "border-amber-200 dark:border-amber-800",
    dotClass: "bg-amber-500",
  },
  [PROJECT_STATUS.APPROVED]: {
    label: "Approved",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/50",
    textClass: "text-emerald-700 dark:text-emerald-300",
    borderClass: "border-emerald-200 dark:border-emerald-800",
    dotClass: "bg-emerald-500",
  },
  [PROJECT_STATUS.COMPLETED]: {
    label: "Completed",
    bgClass: "bg-emerald-100 dark:bg-emerald-950",
    textClass: "text-emerald-800 dark:text-emerald-200",
    borderClass: "border-emerald-300 dark:border-emerald-700",
    dotClass: "bg-emerald-600",
  },
  [PROJECT_STATUS.OVERDUE]: {
    label: "Overdue",
    bgClass: "bg-rose-50 dark:bg-rose-950/50",
    textClass: "text-rose-700 dark:text-rose-300",
    borderClass: "border-rose-200 dark:border-rose-800",
    dotClass: "bg-rose-500",
  },
};

export const TASK_STATUS_CONFIG = {
  [TASK_STATUS.NOT_STARTED]: {
    label: "To Do",
    badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
  },
  [TASK_STATUS.IN_PROGRESS]: {
    label: "In Progress",
    badgeBg: "bg-sky-100 text-sky-800 border-sky-200",
  },
  [TASK_STATUS.COMPLETED]: {
    label: "Done",
    badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  [TASK_STATUS.OVERDUE]: {
    label: "Overdue",
    badgeBg: "bg-rose-100 text-rose-800 border-rose-200",
  },
};

export const FILE_UPLOAD_LIMITS = {
  MAX_FILE_SIZE_BYTES: 25 * 1024 * 1024, // 25 MB
  ALLOWED_EXTENSIONS: [".pdf", ".png", ".jpg", ".jpeg", ".zip", ".mp4", ".docx", ".xlsx"],
  ALLOWED_MIME_TYPES: [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "application/zip",
    "application/x-zip-compressed",
    "video/mp4",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
};

export const MODULE_ROUTES = {
  PROJECTS_LIST: "/student/projects",
  PROJECT_DETAILS: (id = ":id") => `/student/projects/${id}`,
  PROJECT_SUBMISSION: (id = ":id") => `/student/projects/${id}/submit`,
  PROJECT_ANALYTICS: (id = ":id") => `/student/projects/${id}/analytics`,
};
