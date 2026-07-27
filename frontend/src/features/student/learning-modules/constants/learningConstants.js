/**
 * Central constants for the Learning Modules feature.
 * Keep all magic strings and values here so components/services
 * never hardcode them.
 */

/** @enum {string} Valid difficulty levels for learning modules. */
export const MODULE_LEVELS = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

/** @enum {string} Valid categories for learning modules. */
export const MODULE_CATEGORIES = {
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  DEVOPS: "DevOps",
  DATABASE: "Database",
  CLOUD: "Cloud",
  MOBILE: "Mobile",
};

/** @enum {string} Valid resource types within lesson content. */
export const RESOURCE_TYPES = {
  LINK: "link",
  VIDEO: "video",
  DOCUMENT: "document",
  PDF: "pdf",
};

/** @enum {number} Milestone progress percentages for UI/gating logic. */
export const PROGRESS_STATUS = {
  NOT_STARTED: 0,
  IN_PROGRESS: 30,
  NEAR_COMPLETE: 70,
  COMPLETED: 100,
};

/**
 * Tailwind CSS badge classes for module difficulty levels.
 * @type {Record<string, string>}
 */
export const LEVEL_COLORS = {
  [MODULE_LEVELS.BEGINNER]: "bg-green-100 text-green-800",
  [MODULE_LEVELS.INTERMEDIATE]: "bg-yellow-100 text-yellow-800",
  [MODULE_LEVELS.ADVANCED]: "bg-red-100 text-red-800",
};

/**
 * Tailwind CSS badge classes for module categories.
 * @type {Record<string, string>}
 */
export const CATEGORY_COLORS = {
  [MODULE_CATEGORIES.FRONTEND]: "bg-blue-100 text-blue-800",
  [MODULE_CATEGORIES.BACKEND]: "bg-purple-100 text-purple-800",
  [MODULE_CATEGORIES.DEVOPS]: "bg-orange-100 text-orange-800",
  [MODULE_CATEGORIES.DATABASE]: "bg-teal-100 text-teal-800",
  [MODULE_CATEGORIES.CLOUD]: "bg-indigo-100 text-indigo-800",
  [MODULE_CATEGORIES.MOBILE]: "bg-pink-100 text-pink-800",
};
