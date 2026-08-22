// liveSessionsConstants.js
// Central constants for the Live Sessions module

export const LIVE_SESSIONS_API = {
  GET_SESSIONS:    "/api/students/:id/live-sessions",
  GET_SESSION_BY_ID: "/api/students/live-sessions/:sessionId",
  GET_ATTENDANCE:  "/api/students/live-sessions/:sessionId/attendance",
  GET_RECORDINGS:  "/api/students/live-sessions/:sessionId/recordings",
};

export const LOADING_STATES = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

export const SESSION_STATUS = {
  UPCOMING: "Upcoming",
  LIVE: "Live",
  COMPLETED: "Completed",
};

export const SESSION_STATUS_COLORS = {
  [SESSION_STATUS.UPCOMING]:  { bg: "bg-blue-50",   text: "text-blue-600",   border: "border-blue-200" },
  [SESSION_STATUS.LIVE]:      { bg: "bg-red-50",    text: "text-red-600",    border: "border-red-200" },
  [SESSION_STATUS.COMPLETED]: { bg: "bg-green-50",  text: "text-green-600",  border: "border-green-200" },
};

export const ATTENDANCE_STATUS = {
  PRESENT: "Present",
  ABSENT: "Absent",
  NOT_MARKED: "Not Marked",
};

export const ATTENDANCE_STATUS_COLORS = {
  [ATTENDANCE_STATUS.PRESENT]:    { bg: "bg-green-50", text: "text-green-600" },
  [ATTENDANCE_STATUS.ABSENT]:     { bg: "bg-red-50",    text: "text-red-600" },
  [ATTENDANCE_STATUS.NOT_MARKED]: { bg: "bg-gray-100",  text: "text-gray-500" },
};

// Minutes before a session's official start time that the Join button becomes active
export const JOIN_WINDOW_MINUTES = 10;

export const SESSION_FILTERS = ["All", SESSION_STATUS.UPCOMING, SESSION_STATUS.LIVE, SESSION_STATUS.COMPLETED];

export const EMPTY_MESSAGES = {
  SESSIONS: "No live sessions found for the selected filter.",
  RECORDINGS: "No recordings are available for this session yet.",
};
