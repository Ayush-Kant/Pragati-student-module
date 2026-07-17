import participantModel from "../models/participantModel.js";
import liveSessionModel from "../models/liveSessionModel.js";

export const getParticipants = async (sessionId) => {
  const session = await liveSessionModel.getSessionById(sessionId);
  if (!session) {
    const error = new Error("Session not found");
    error.status = 404;
    throw error;
  }
  return await participantModel.getParticipants(sessionId);
};

export const addParticipant = async (sessionId, studentId) => {
  const session = await liveSessionModel.getSessionById(sessionId);
  if (!session) {
    const error = new Error("Session not found");
    error.status = 404;
    throw error;
  }

  try {
    return await participantModel.addParticipant(sessionId, studentId);
  } catch (error) {
    if (error.message === "Student not found") {
      error.status = 404;
    }
    throw error;
  }
};

export const removeParticipant = async (sessionId, studentId) => {
  const session = await liveSessionModel.getSessionById(sessionId);
  if (!session) {
    const error = new Error("Session not found");
    error.status = 404;
    throw error;
  }
  const deleted = await participantModel.removeParticipant(sessionId, studentId);
  if (!deleted) {
    const error = new Error("Participant not found");
    error.status = 404;
    throw error;
  }
  return deleted;
};

export default {
  getParticipants,
  addParticipant,
  removeParticipant,
};
