// liveSessionsHelpers.js
// Pure utility/formatting helpers used across the Live Sessions module

import { JOIN_WINDOW_MINUTES } from "../constants/liveSessionsConstants";

/**
 * Filter sessions by status ("All" | "Upcoming" | "Live" | "Completed").
 */
export const filterSessionsByStatus = (sessions, status = "All") => {
  if (status === "All") return sessions;
  return sessions.filter((session) => session.status === status);
};

/**
 * Sort sessions chronologically — soonest upcoming/live first, most recent completed last.
 */
export const sortSessionsByStartTime = (sessions, order = "asc") => {
  const sorted = [...sessions].sort(
    (a, b) => new Date(a.startTime) - new Date(b.startTime)
  );
  return order === "desc" ? sorted.reverse() : sorted;
};

/**
 * Format an ISO datetime string into a readable date + time, e.g. "Aug 5, 2026 · 10:00 AM".
 */
export const formatSessionTime = (isoString) => {
  if (!isoString) return "—";
  const date = new Date(isoString);
  const datePart = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${datePart} · ${timePart}`;
};

/**
 * Whether the "Join Session" button should be enabled — true once we're within
 * JOIN_WINDOW_MINUTES of the start time and before the session's end time.
 */
export const canJoinSession = (session, now = new Date()) => {
  if (!session?.startTime || !session?.endTime) return false;
  const start = new Date(session.startTime);
  const end = new Date(session.endTime);
  const joinOpensAt = new Date(start.getTime() - JOIN_WINDOW_MINUTES * 60 * 1000);
  return now >= joinOpensAt && now <= end;
};

/**
 * Human readable countdown/status caption for a session card.
 */
export const getSessionTimingLabel = (session, now = new Date()) => {
  const start = new Date(session.startTime);
  const end = new Date(session.endTime);

  if (session.status === "Completed" || now > end) return "Session ended";
  if (now >= start && now <= end) return "Live now";

  const diffMs = start - now;
  const diffMins = Math.round(diffMs / 60000);
  if (diffMins < 60) return `Starts in ${diffMins} min`;
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `Starts in ${diffHours} hr`;
  const diffDays = Math.round(diffHours / 24);
  return `Starts in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
};
