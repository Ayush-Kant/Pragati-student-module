// liveSessionService.js
// All API calls for the Live Sessions module live here — nowhere else.
// Currently backed by shared dummy data (see /types/liveSessionDummyData.js).
// To integrate with the real backend: replace the body of each function
// with a `fetch(`${API_BASE_URL}/...`)` call. Signatures and return shapes
// below are designed to stay identical either way, so no caller changes.

import { liveSessions } from "../types/liveSessionDummyData";
import { API_BASE_URL, MOCK_API_DELAY_MS } from "../constants/liveSessionConstants";
import {
  validateSession,
  validateJoinRequest,
  validateAttendance,
  validateRecording,
} from "../validations/liveSessionValidation";

// In-memory clone so mock "mutations" (join/leave/attendance) don't
// silently mutate the imported dummy data module across the app.
let sessionStore = liveSessions.map((s) => ({ ...s }));

function delay(ms = MOCK_API_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function wrapSuccess(data) {
  return { success: true, data, error: null };
}

function wrapError(message) {
  return { success: false, data: null, error: message };
}

function findSession(sessionId) {
  return sessionStore.find((s) => String(s.id) === String(sessionId));
}

/** GET all live sessions. */
export async function getLiveSessions() {
  try {
    await delay();
    // Real backend equivalent:
    // const res = await fetch(`${API_BASE_URL}`); const json = await res.json();
    return wrapSuccess(sessionStore.map((s) => ({ ...s })));
  } catch (err) {
    return wrapError(err.message || "Failed to fetch live sessions");
  }
}

/** GET a single session by id. */
export async function getSessionById(sessionId) {
  try {
    await delay();
    const session = findSession(sessionId);
    if (!session) return wrapError(`Session ${sessionId} not found`);

    const { valid, errors } = validateSession(session);
    if (!valid) return wrapError(errors.join(", "));

    return wrapSuccess({ ...session });
  } catch (err) {
    return wrapError(err.message || "Failed to fetch session");
  }
}

/** POST join request for a session. */
export async function joinSession(sessionId) {
  try {
    await delay(200);
    const session = findSession(sessionId);
    if (!session) return wrapError(`Session ${sessionId} not found`);

    const { valid, errors } = validateJoinRequest(session);
    if (!valid) return wrapError(errors.join(", "));

    if (session.status === "Upcoming") {
      session.status = "Ongoing";
    }
    return wrapSuccess({ meetingLink: session.meetingLink, session: { ...session } });
  } catch (err) {
    return wrapError(err.message || "Failed to join session");
  }
}

/** POST leave request for a session. */
export async function leaveSession(sessionId) {
  try {
    await delay(200);
    const session = findSession(sessionId);
    if (!session) return wrapError(`Session ${sessionId} not found`);
    return wrapSuccess({ session: { ...session } });
  } catch (err) {
    return wrapError(err.message || "Failed to leave session");
  }
}

/** GET attendance for a session. */
export async function getAttendance(sessionId) {
  try {
    await delay();
    const session = findSession(sessionId);
    if (!session) return wrapError(`Session ${sessionId} not found`);
    return wrapSuccess({ sessionId, attendance: session.attendance });
  } catch (err) {
    return wrapError(err.message || "Failed to fetch attendance");
  }
}

/** PATCH attendance for a session (e.g. marked present on join). */
export async function updateAttendance(sessionId, attendanceValue) {
  try {
    await delay(200);
    const { valid, errors } = validateAttendance(sessionId, attendanceValue);
    if (!valid) return wrapError(errors.join(", "));

    const session = findSession(sessionId);
    if (!session) return wrapError(`Session ${sessionId} not found`);

    session.attendance = attendanceValue;
    return wrapSuccess({ sessionId, attendance: session.attendance });
  } catch (err) {
    return wrapError(err.message || "Failed to update attendance");
  }
}

/** GET all recordings (i.e. completed sessions that have a recordingUrl). */
export async function getRecordings() {
  try {
    await delay();
    const recordings = sessionStore.filter((s) => !!s.recordingUrl).map((s) => ({ ...s }));
    return wrapSuccess(recordings);
  } catch (err) {
    return wrapError(err.message || "Failed to fetch recordings");
  }
}

/** GET/trigger download of a single recording. */
export async function downloadRecording(sessionId) {
  try {
    await delay(200);
    const session = findSession(sessionId);
    if (!session) return wrapError(`Session ${sessionId} not found`);

    const { valid, errors } = validateRecording(session);
    if (!valid) return wrapError(errors.join(", "));

    return wrapSuccess({ url: session.recordingUrl, filename: `${session.title}.mp4` });
  } catch (err) {
    return wrapError(err.message || "Failed to download recording");
  }
}

// Exposed only so integration can point this module at a real base URL
// without touching call sites.
export const _serviceConfig = { API_BASE_URL };
