import * as statisticsService from "../services/college.departmentstatistics.service.js";

/**
 * Location: backend/controllers/college.departmentstatistics.controller.js
 */

export const getDepartmentStatistics = async (req, res, next) => {
  try {
    const { departmentId } = req.query;
    const statistics = await statisticsService.getStatistics(departmentId || null);
    res.status(200).json({ success: true, data: statistics });
  } catch (err) {
    next(err);
  }
};

export const updateDepartmentStatistics = async (req, res, next) => {
  try {
    const statistics = await statisticsService.updateStatistics(req.body);
    res.status(200).json({ success: true, message: "Department statistics updated successfully.", data: statistics });
  } catch (err) {
    next(err);
  }
};

export default { getDepartmentStatistics, updateDepartmentStatistics };