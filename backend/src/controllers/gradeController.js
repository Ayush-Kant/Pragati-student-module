import * as gradeService from "../services/gradeService.js";
import { normalizeStudentId } from "../utils/assignmentHelpers.js";

export const getGrades = async (req, res, next) => {
  try {
    const studentId = normalizeStudentId(req);
    const grades = await gradeService.getGrades(studentId);

    res.status(200).json({
      success: true,
      data: grades,
      count: grades.length,
    });
  } catch (error) {
    next(error);
  }
};

export const updateGrades = async (req, res, next) => {
  try {
    const studentId = normalizeStudentId(req);
    const grade = await gradeService.updateGrades(req.params.id, studentId, req.body);

    res.status(200).json({
      success: true,
      message: "Grade updated successfully",
      data: grade,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getGrades,
  updateGrades,
};
