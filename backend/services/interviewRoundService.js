import * as InterviewRoundModel from "../models/interviewRoundModel.js";
import { getPlacementDriveById } from "../models/placementDriveModel.js";

const checkDriveExists = async (driveId) => {
  const drive = await getPlacementDriveById(driveId);

  if (!drive) {
    const error = new Error("Placement Drive not found");
    error.statusCode = 404;
    throw error;
  }
};

export const getInterviewRounds = async (driveId) => {
  await checkDriveExists(driveId);

  return await InterviewRoundModel.getInterviewRounds(driveId);
};

export const addInterviewRound = async (driveId, data) => {
  await checkDriveExists(driveId);

  return await InterviewRoundModel.createInterviewRound(
    driveId,
    data
  );
};

export const updateInterviewRound = async (
  driveId,
  roundId,
  data
) => {
  await checkDriveExists(driveId);

  const updated =
    await InterviewRoundModel.updateInterviewRound(
      driveId,
      roundId,
      data
    );

  if (!updated) {
    const error = new Error("Interview round not found");
    error.statusCode = 404;
    throw error;
  }

  return updated;
};

export const deleteInterviewRound = async (
  driveId,
  roundId
) => {
  await checkDriveExists(driveId);

  const deleted =
    await InterviewRoundModel.deleteInterviewRound(
      driveId,
      roundId
    );

  if (!deleted) {
    const error = new Error("Interview round not found");
    error.statusCode = 404;
    throw error;
  }

  return deleted;
};