import gradeModel from "../models/gradeModel.js";
import assignmentModel from "../models/assignmentModel.js";
import { createAssignmentError, isInstructorOrAdmin } from "../utils/assignmentHelpers.js";

export const getGrades = async (query = {}, user) => {
  return await gradeModel.getGrades(query, user);
};

export const updateGrades = async (assignmentId, payload, user) => {
  const assignment = await assignmentModel.getAssignmentById(assignmentId);
  if (!assignment) {
    const error = new Error("Assignment not found");
    error.status = 404;
    throw error;
  }

  if (!isInstructorOrAdmin(user)) {
    throw createAssignmentError("Access forbidden", 403);
  }

  return await gradeModel.updateGrades(assignmentId, payload, user);
};

export default { getGrades, updateGrades };
