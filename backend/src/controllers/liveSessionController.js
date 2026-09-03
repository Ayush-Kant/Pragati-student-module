import liveSessionService from "../services/liveSessionService.js";
import { normalizeStudentId } from "../utils/assignmentHelpers.js";

export const getAllSessions = async (req, res, next) => {
  try {
    const studentId = await normalizeStudentId(req);
    const sessions = await liveSessionService.getSessions(studentId, {
      status: req.query?.status,
      page: req.query?.page,
      limit: req.query?.limit,
    });
    res.status(200).json({ success: true, data: sessions });
  } catch (error) { next(error); }
};

export const getSessionById = async (req, res, next) => {
  try {
    const { id } = req.validatedParams || req.params;
    const studentId = await normalizeStudentId(req);
    const session = await liveSessionService.getSession(id, studentId);
    res.status(200).json({ success: true, data: session });
  } catch (error) { next(error); }
};

export const joinSession = async (req, res, next) => {
  try {
    const { id: sessionId } = req.validatedParams || req.params;
    const studentId = await normalizeStudentId(req);
    const participant = await liveSessionService.joinSession(sessionId, studentId, req.user?.fullName || req.user?.name);
    res.status(200).json({ success: true, message: "Joined session successfully", data: participant });
  } catch (error) { next(error); }
};

export const leaveSession = async (req, res, next) => {
  try {
    const { id: sessionId } = req.validatedParams || req.params;
    const studentId = await normalizeStudentId(req);
    const participant = await liveSessionService.leaveSession(sessionId, studentId);
    res.status(200).json({ success: true, message: "Left session successfully", data: participant });
  } catch (error) { next(error); }
};

export default { getAllSessions, getSessionById, joinSession, leaveSession };
