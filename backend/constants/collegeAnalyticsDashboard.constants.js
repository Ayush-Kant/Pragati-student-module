/**
 * Location: backend/constants/collegeAnalyticsDashboard.constants.js
 */

export const ANALYTICS_LIMITS = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  DEFAULT_PAGE: 1,
};

export const PLACEMENT_STATUS = {
  PLACED: "Placed",
  ELIGIBLE: "Eligible",
  UNPLACED: "Unplaced",
  NOT_ELIGIBLE: "Not Eligible",
};

export const EXPORT_FORMATS = {
  PDF: "pdf",
  EXCEL: "excel",
};

export const ROLES = {
  COLLEGE: "college",
  ADMIN: "admin",
};

export default {
  ANALYTICS_LIMITS,
  PLACEMENT_STATUS,
  EXPORT_FORMATS,
  ROLES,
};
