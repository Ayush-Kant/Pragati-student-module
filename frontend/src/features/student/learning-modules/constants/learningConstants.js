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
  [MODULE_LEVELS.BEGINNER]: "bg-gradient-to-r from-teal-500/20 to-teal-600/20 text-teal-400 border border-teal-500/30 shadow-lg shadow-teal-500/10",
  [MODULE_LEVELS.INTERMEDIATE]: "bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400 border border-orange-500/30 shadow-lg shadow-orange-500/10",
  [MODULE_LEVELS.ADVANCED]: "bg-gradient-to-r from-orange-600/20 to-red-500/20 text-orange-500 border border-orange-600/30 shadow-lg shadow-orange-600/10",
};

/**
 * Tailwind CSS badge classes for module categories.
 * @type {Record<string, string>}
 */
export const CATEGORY_COLORS = {
  [MODULE_CATEGORIES.FRONTEND]: "bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400 border border-orange-500/30 shadow-lg shadow-orange-500/10",
  [MODULE_CATEGORIES.BACKEND]: "bg-gradient-to-r from-teal-500/20 to-teal-600/20 text-teal-400 border border-teal-500/30 shadow-lg shadow-teal-500/10",
  [MODULE_CATEGORIES.DEVOPS]: "bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400 border border-orange-500/30 shadow-lg shadow-orange-500/10",
  [MODULE_CATEGORIES.DATABASE]: "bg-gradient-to-r from-teal-500/20 to-teal-600/20 text-teal-400 border border-teal-500/30 shadow-lg shadow-teal-500/10",
  [MODULE_CATEGORIES.CLOUD]: "bg-gradient-to-r from-orange-400/20 to-orange-500/20 text-orange-300 border border-orange-400/30 shadow-lg shadow-orange-400/10",
  [MODULE_CATEGORIES.MOBILE]: "bg-gradient-to-r from-teal-400/20 to-teal-500/20 text-teal-300 border border-teal-400/30 shadow-lg shadow-teal-400/10",
};
