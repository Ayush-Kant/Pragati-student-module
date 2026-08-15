import * as assignmentService from "../services/assignmentService.js";
import { normalizeStudentId } from "../utils/assignmentHelpers.js";

export const getAllAssignments = async (req, res, next) => {
  try {
    const studentId = normalizeStudentId(req);
    const assignments = await assignmentService.getAssignments(studentId);

    res.status(200).json({
      success: true,
      data: assignments,
      count: assignments.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getAssignmentById = async (req, res, next) => {
  try {
    const studentId = normalizeStudentId(req);
    const assignment = await assignmentService.getAssignment(req.params.id, studentId);

    res.status(200).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllAssignments,
  getAssignmentById,
};
