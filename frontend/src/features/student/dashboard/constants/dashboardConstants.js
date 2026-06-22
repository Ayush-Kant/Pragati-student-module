
// API Endpoints 
export const DASHBOARD_API = {
  GET_DASHBOARD:      "/api/students/:id/dashboard",
  GET_LEADERBOARD:    "/api/students/leaderboard",
  GET_QUICK_STATS:    "/api/students/:id/stats",
  GET_NOTIFICATIONS:  "/api/students/:id/notifications",
  GET_SESSIONS:       "/api/students/:id/sessions",
  GET_TASKS:          "/api/students/:id/tasks",
  GET_ACTIVE_DRIVE:   "/api/drives/active",
};

// Loading States 
export const LOADING_STATES = {
  IDLE:    "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR:   "error",
};

//  Leaderboard
export const LEADERBOARD_PREVIEW_LIMIT = 5;

// Priority Colors 
export const PRIORITY_COLORS = {
  high:   { bg: "bg-red-50",    text: "text-red-600",    border: "border-red-200" },
  medium: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200" },
  low:    { bg: "bg-green-50",  text: "text-green-600",  border: "border-green-200" },
};

// Notification Types 
export const NOTIFICATION_ICONS = {
  drive:     "🏢",
  shortlist: "✅",
  session:   "📅",
  default:   "🔔",
};

//  Session Types 
export const SESSION_TYPES = {
  workshop:  { label: "Workshop",  bg: "bg-blue-50",   text: "text-blue-600" },
  interview: { label: "Interview", bg: "bg-purple-50", text: "text-purple-600" },
  default:   { label: "Session",   bg: "bg-gray-50",   text: "text-gray-600" },
};
// Rank Badges 
export const RANK_BADGE = {
  1: {
    emoji: "🥇",
    color: "text-yellow-500",
  },
  2: {
    emoji: "🥈",
    color: "text-gray-400",
  },
  3: {
    emoji: "🥉",
    color: "text-amber-600",
  },
};