// Editable columns allowlists to prevent SQL Column Injection (B1)
export const ANNOUNCEMENT_UPDATE_COLUMNS = new Set([
  "title",
  "description",
  "category_id",
  "priority",
  "target_audience",
  "announcement_type",
  "visibility",
  "tags",
  "expiry_date",
  "attachment_url",
  "image_url",
]);

export const NOTIFICATION_UPDATE_COLUMNS = new Set([
  "announcement_id",
  "title",
  "message",
  "audience",
  "scheduled_at",
]);

// Enum definitions for B4 validation
export const ANNOUNCEMENT_PRIORITIES = ["High", "Medium", "Low"];
export const ANNOUNCEMENT_TARGET_AUDIENCES = [
  "All Students",
  "1st Year Students",
  "CSE Department",
  "ECE Department",
  "ME Department",
];
export const ANNOUNCEMENT_TYPES = ["General", "Academic", "Placement", "Event"];
export const ANNOUNCEMENT_VISIBILITIES = ["Public", "Internal"];
export const NOTIFICATION_AUDIENCES = [
  "All Students",
  "1st Year Students",
  "CSE Department",
  "ECE Department",
  "ME Department",
];

// Default Pagination constants (B2)
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;