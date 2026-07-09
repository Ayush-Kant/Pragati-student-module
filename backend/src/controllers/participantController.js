import participantService from "../services/participantService.js";

export const getParticipants = async (req, res, next) => {
  try {
    const { id: sessionId } = req.validatedParams || req.params;
    const participants = await participantService.getParticipants(sessionId);
    res.status(200).json({
      success: true,
      data: participants,
    });
  } catch (error) {
    next(error);
  }
};

export const addParticipant = async (req, res, next) => {
  try {
    const { id: sessionId } = req.validatedParams || req.params;
    const body = req.validatedBody || req.body;
    const studentId = body?.studentId ?? req.user.id;
    const participant = await participantService.addParticipant(sessionId, studentId);
    res.status(200).json({
      success: true,
      message: "Participant added successfully",
      data: participant,
    });
  } catch (error) {
    next(error);
  }
};

export const removeParticipant = async (req, res, next) => {
  try {
    const { id: sessionId, participantId } = req.validatedParams || req.params;

    if (req.user.role === "student" && Number(participantId) !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Students can only remove themselves from a session.",
      });
    }

    const participant = await participantService.removeParticipant(sessionId, participantId);
    res.status(200).json({
      success: true,
      message: "Participant removed successfully",
      data: participant,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getParticipants,
  addParticipant,
  removeParticipant,
};
