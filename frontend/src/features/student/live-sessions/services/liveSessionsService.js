// liveSessionsService.js
// API service layer for the Live Sessions module.
// Currently backed by shared dummy data — swap the body of each function
// for a real fetch/axios call to BASE_URL + LIVE_SESSIONS_API.* during integration.
// No hardcoded URLs: endpoint paths live in liveSessionsConstants.js

import { liveSessions } from "../types/liveSessionDummyData";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ── Helper — simulate network latency with dummy data ──────────
const simulateApi = (data, delay = 400) =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), delay));

// ─────────────────────────────────────────────────────
// SESSIONS
// ─────────────────────────────────────────────────────

export const getLiveSessions = async () => {
  // TODO(integration): fetch(`${BASE_URL}${LIVE_SESSIONS_API.GET_SESSIONS}`, { headers: getHeaders() })
  return simulateApi(liveSessions);
};

export const getSessionById = async (sessionId) => {
  const session = liveSessions.find((s) => s.id === Number(sessionId));
  if (!session) throw new Error("Session not found");
  return simulateApi(session);
};

// ─────────────────────────────────────────────────────
// ATTENDANCE
// ─────────────────────────────────────────────────────

export const getAttendance = async (sessionId) => {
  const session = liveSessions.find((s) => s.id === Number(sessionId));
  if (!session) throw new Error("Session not found");
  return simulateApi({ sessionId: session.id, status: session.attendanceStatus });
};

// ─────────────────────────────────────────────────────
// RECORDINGS
// ─────────────────────────────────────────────────────

export const getRecordings = async (sessionId) => {
  const session = liveSessions.find((s) => s.id === Number(sessionId));
  if (!session) throw new Error("Session not found");
  return simulateApi({
    sessionId: session.id,
    recordingUrl: session.recordingUrl,
    available: Boolean(session.recordingUrl),
  });
};

export { BASE_URL, getHeaders };
