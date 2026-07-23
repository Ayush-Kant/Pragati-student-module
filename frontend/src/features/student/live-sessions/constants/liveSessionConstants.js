// Central constants for the Live Sessions feature.
// Keep all magic strings here so components/services never hardcode them.

export const SESSION_STATUS = {
  UPCOMING: "Upcoming",
  ONGOING: "Ongoing",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const ATTENDANCE_STATUS = {
  PENDING: "Pending",
  PRESENT: "Present",
  ABSENT: "Absent",
  LATE: "Late",
};

export const SESSION_STATUS_OPTIONS = [
  "All",
  SESSION_STATUS.UPCOMING,
  SESSION_STATUS.ONGOING,
  SESSION_STATUS.COMPLETED,
  SESSION_STATUS.CANCELLED,
];

export const DATE_FILTER_OPTIONS = [
  { value: "all", label: "All Dates" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

// Simulated network latency for dummy API calls so loading states are visible.
export const MOCK_API_DELAY_MS = 500;

// Base path — swap this for the real backend base URL during integration.
// Per project rules: no hardcoded API URLs in components, only here.
export const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || "/api/live-sessions";

export const DAILY_CO_DOMAIN = import.meta.env?.VITE_DAILY_CO_DOMAIN || "";
