import * as ScheduleService from "../services/scheduleService.js";

export const getDriveSchedule = async (req, res, next) => {
  try {
    const schedule = await ScheduleService.getSchedule(req.params.id);
    res.status(200).json(schedule);
  } catch (error) {
    next(error);
  }
};

export const updateSchedule = async (req, res, next) => {
  try {
    const updatedSchedule = await ScheduleService.updateSchedule(req.params.id, req.body);
    res.status(200).json(updatedSchedule);
  } catch (error) {
    next(error);
  }
};
