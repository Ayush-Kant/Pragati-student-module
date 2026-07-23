import * as ScheduleModel from "../models/scheduleModel.js";
import { getPlacementDriveById } from "../models/placementDriveModel.js";

const checkDriveExists = async (driveId) => {
  const drive = await getPlacementDriveById(driveId);
  if (!drive) {
    const error = new Error("Placement Drive not found");
    error.statusCode = 404;
    throw error;
  }
};

export const getSchedule = async (driveId) => {
  await checkDriveExists(driveId);
  const schedule = await ScheduleModel.getDriveSchedule(driveId);
  if (!schedule) {
    const error = new Error("Schedule not found for this drive");
    error.statusCode = 404;
    throw error;
  }
  return schedule;
};

export const updateSchedule = async (driveId, data) => {
  await checkDriveExists(driveId);
  return await ScheduleModel.updateDriveSchedule(driveId, data);
};
