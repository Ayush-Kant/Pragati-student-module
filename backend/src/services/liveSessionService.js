import liveSessionModel from "../models/liveSessionModel.js";

const sessionDurationMinutes = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) return Math.max(0, value);
  const text = String(value || "").trim().toLowerCase();
  const match = text.match(/(\d+(?:\.\d+)?)\s*(hours?|hrs?|h|minutes?|mins?|m)?/i);
  if (!match) return 0;
  const amount = Number(match[1]);
  if (!Number.isFinite(amount)) return 0;
  const unit = match[2] || "minutes";
  return /^(hours?|hrs?|h)$/.test(unit) ? amount * 60 : amount;
};

export const getSessions = async (studentId, filters = {}) => liveSessionModel.getAllSessions(studentId, filters);

export const getSession = async (id, studentId) => {
  const session = await liveSessionModel.getSessionById(id, studentId);
  if (!session) {
    const error = new Error("Session not found");
    error.status = 404;
    throw error;
  }
  return session;
};

export const joinSession = async (sessionId, studentId, userName) => {
  const session = await liveSessionModel.getSessionById(sessionId, studentId);
  if (!session) {
    const error = new Error("Session not found");
    error.status = 404;
    throw error;
  }

  const start = session.scheduledAt ? new Date(session.scheduledAt).getTime() : NaN;
  const durationMinutes = sessionDurationMinutes(session.duration);
  const joinableAt = Number.isFinite(start) ? start - 10 * 60 * 1000 : NaN;
  const endAt = Number.isFinite(start) && durationMinutes > 0
    ? start + durationMinutes * 60 * 1000
    : NaN;

  if (session.status === "Completed") {
    const error = new Error("This session has already ended");
    error.status = 403;
    throw error;
  }

  if (Number.isFinite(start) && Date.now() >= start && Number.isFinite(endAt) && Date.now() > endAt) {
    const error = new Error("This session has already ended");
    error.status = 403;
    throw error;
  }

  if (Number.isFinite(joinableAt) && Date.now() < joinableAt && session.status !== "Live") {
    const error = new Error(`Session becomes joinable at ${new Date(joinableAt).toISOString()}`);
    error.status = 403;
    throw error;
  }

  return liveSessionModel.joinSession(sessionId, studentId, userName, durationMinutes);
};

export const leaveSession = async (sessionId, studentId) => {
  const session = await liveSessionModel.getSessionById(sessionId, studentId);
  if (!session) {
    const error = new Error("Session not found");
    error.status = 404;
    throw error;
  }
  const participant = await liveSessionModel.leaveSession(sessionId, studentId);
  if (!participant) {
    const error = new Error("Student was not joined to this session");
    error.status = 400;
    throw error;
  }
  return participant;
};

export default { getSessions, getSession, joinSession, leaveSession };
