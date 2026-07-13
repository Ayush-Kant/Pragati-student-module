import liveSessionModel from "../models/liveSessionModel.js";

export const getSessions = async () => {
  return await liveSessionModel.getAllSessions();
};

export const getSession = async (id) => {
  const session = await liveSessionModel.getSessionById(id);
  if (!session) {
    const error = new Error("Session not found");
    error.status = 404;
    throw error;
  }
  return session;
};

export const joinSession = async (sessionId, studentId) => {
  const session = await liveSessionModel.getSessionById(sessionId);
  if (!session) {
    const error = new Error("Session not found");
    error.status = 404;
    throw error;
  }

  try {
    return await liveSessionModel.joinSession(sessionId, studentId);
  } catch (error) {
    if (error.message === "Student not found") {
      error.status = 404;
    }
    throw error;
  }
};

export const leaveSession = async (sessionId, studentId) => {
  const session = await liveSessionModel.getSessionById(sessionId);
  if (!session) {
    const error = new Error("Session not found");
    error.status = 404;
    throw error;
  }

  try {
    const participant = await liveSessionModel.leaveSession(sessionId, studentId);
    if (!participant) {
      const error = new Error("Student was not joined to this session");
      error.status = 400;
      throw error;
    }
    return participant;
  } catch (error) {
    if (error.message === "Student not found") {
      error.status = 404;
    }
    throw error;
  }
};

export default {
  getSessions,
  getSession,
  joinSession,
  leaveSession,
};
