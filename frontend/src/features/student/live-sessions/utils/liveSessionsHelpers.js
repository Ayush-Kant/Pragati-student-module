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
 * Whether the "Join Session" button should be enabled.
 * The backend is authoritative when it provides `joinable`; the client-side
 * time calculation is retained as a compatibility fallback for older APIs.
 */
export const canJoinSession = (session, now = new Date()) => {
  if (!session || session.status === "Completed") return false;
  if (typeof session.joinable === "boolean") return session.joinable;
  if (!session?.startTime || !session?.endTime) return false;

  const start = new Date(session.startTime);
  const end = new Date(session.endTime);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;

  const joinOpensAt = new Date(start.getTime() - JOIN_WINDOW_MINUTES * 60 * 1000);
  return now >= joinOpensAt && now <= end;
};

/**
 * Human readable countdown/status caption for a session card.
 */
export const getSessionTimingLabel = (session, now = new Date()) => {
  if (!session?.startTime) return "Schedule unavailable";
  const start = new Date(session.startTime);
  const end = session.endTime ? new Date(session.endTime) : null;

  if (Number.isNaN(start.getTime())) return "Schedule unavailable";
  if (session.status === "Completed" || (end && !Number.isNaN(end.getTime()) && now > end)) return "Session ended";
  if (now >= start && (!end || now <= end)) return "Live now";

  const diffMs = start - now;
  const diffMins = Math.round(diffMs / 60000);
  if (diffMins < 60) return `Starts in ${Math.max(diffMins, 0)} min`;
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `Starts in ${diffHours} hr`;
  const diffDays = Math.round(diffHours / 24);
  return `Starts in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
};
