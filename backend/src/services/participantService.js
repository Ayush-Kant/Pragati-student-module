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
  return await participantModel.addParticipant(sessionId, studentId);
};

export const removeParticipant = async (sessionId, participantId) => {
  const session = await liveSessionModel.getSessionById(sessionId);
  if (!session) {
    const error = new Error("Session not found");
    error.status = 404;
    throw error;
  }
  const deleted = await participantModel.removeParticipant(sessionId, participantId);
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
