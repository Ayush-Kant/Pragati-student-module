import scheduleModel from "../models/scheduleModel.js";

export const getSchedules = async () => {
  return await scheduleModel.getSchedules();
};

export const getUpcomingSessions = async () => {
  return await scheduleModel.getUpcomingSessions();
};

export default {
  getSchedules,
  getUpcomingSessions,
};
