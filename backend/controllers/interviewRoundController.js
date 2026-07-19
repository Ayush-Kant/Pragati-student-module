import * as InterviewRoundService from "../services/interviewRoundService.js";

export const getInterviewRounds = async (
  req,
  res,
  next
) => {
  try {
    const rounds =
      await InterviewRoundService.getInterviewRounds(
        req.params.id
      );

    res.status(200).json(rounds);
  } catch (error) {
    next(error);
  }
};

export const createInterviewRound = async (
  req,
  res,
  next
) => {
  try {
    const round =
      await InterviewRoundService.addInterviewRound(
        req.params.id,
        req.body
      );

    res.status(201).json(round);
  } catch (error) {
    next(error);
  }
};

export const updateInterviewRound = async (
  req,
  res,
  next
) => {
  try {
    const round =
      await InterviewRoundService.updateInterviewRound(
        req.params.id,
        req.params.roundId,
        req.body
      );

    res.status(200).json(round);
  } catch (error) {
    next(error);
  }
};

export const deleteInterviewRound = async (
  req,
  res,
  next
) => {
  try {
    const round =
      await InterviewRoundService.deleteInterviewRound(
        req.params.id,
        req.params.roundId
      );

    res.status(200).json({
      success: true,
      message: "Interview round deleted successfully",
      data: round,
    });
  } catch (error) {
    next(error);
  }
};