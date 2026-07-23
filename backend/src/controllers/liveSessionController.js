import liveSessionService from "../services/liveSessionService.js";

export const getAllSessions = async (req, res, next) => {
  try {
    const sessions = await liveSessionService.getSessions();
    res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
};

export const getSessionById = async (req, res, next) => {
  try {
    const { id } = req.validatedParams || req.params;
    const session = await liveSessionService.getSession(id);
    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

export const joinSession = async (req, res, next) => {
  try {
    const { id: sessionId } = req.validatedParams || req.params;
    const studentId = req.user.id;
    const participant = await liveSessionService.joinSession(sessionId, studentId);
    res.status(200).json({
      success: true,
      message: "Joined session successfully",
      data: participant,
    });
  } catch (error) {
    next(error);
  }
};

export const leaveSession = async (req, res, next) => {
  try {
    const { id: sessionId } = req.validatedParams || req.params;
    const studentId = req.user.id;
    const participant = await liveSessionService.leaveSession(sessionId, studentId);
    res.status(200).json({
      success: true,
      message: "Left session successfully",
      data: participant,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllSessions,
  getSessionById,
  joinSession,
  leaveSession,
};
