import * as deadlineService from "../services/deadlineService.js";
import { normalizeStudentId } from "../utils/assignmentHelpers.js";

export const getDeadlines = async (req, res, next) => {
  try {
    const studentId = normalizeStudentId(req);
    const deadlines = await deadlineService.getDeadlines(studentId);

    res.status(200).json({
      success: true,
      data: deadlines,
      count: deadlines.length,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDeadline = async (req, res, next) => {
  try {
    const deadline = await deadlineService.updateDeadline(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Deadline updated successfully",
      data: deadline,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getDeadlines,
  updateDeadline,
};
