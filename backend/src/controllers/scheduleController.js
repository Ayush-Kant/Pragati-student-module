import scheduleService from "../services/scheduleService.js";

export const getSchedules = async (req, res, next) => {
  try {
    const schedules = await scheduleService.getSchedules();
    res.status(200).json({
      success: true,
      data: schedules,
    });
  } catch (error) {
    next(error);
  }
};

export const getUpcomingSessions = async (req, res, next) => {
  try {
    const upcoming = await scheduleService.getUpcomingSessions();
    res.status(200).json({
      success: true,
      data: upcoming,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getSchedules,
  getUpcomingSessions,
};
