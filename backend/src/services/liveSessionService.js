import liveSessionModel from "../models/liveSessionModel.js";

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

const getDurationMinutes = (value) => {
  const match = String(value || '').match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : 0;
};

export const joinSession = async (sessionId, studentId, userName) => {
  const session = await liveSessionModel.getSessionById(sessionId, studentId);
  if (!session) {
    const error = new Error("Session not found");
    error.status = 404;
    throw error;
  }

  const start = session.scheduledAt ? new Date(session.scheduledAt).getTime() : NaN;
  const durationMinutes = getDurationMinutes(session.duration);
  const startBoundary = Number.isFinite(start) ? start - 10 * 60 * 1000 : NaN;
  const endBoundary = Number.isFinite(start) && durationMinutes > 0 ? start + durationMinutes * 60 * 1000 : NaN;

  if (Number.isFinite(startBoundary) && Date.now() < startBoundary && session.status !== 'Live') {
    const error = new Error(`Session becomes joinable at ${new Date(startBoundary).toISOString()}`);
    error.status = 403;
    throw error;
  }
  if (Number.isFinite(endBoundary) && Date.now() > endBoundary && session.status !== 'Live') {
    const error = new Error('This session is no longer accepting joins');
    error.status = 403;
    throw error;
  }
  if (session.status === 'Completed') {
    const error = new Error('This session has already ended');
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
