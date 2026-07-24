import * as assignmentModel from "../models/assignmentModel.js";
import { createError } from "../utils/assignmentHelpers.js";

export const getAssignments = async (studentId) => {
  const assignments = await assignmentModel.getAllAssignments(studentId);
  return assignments;
};

export const getAssignment = async (id, studentId) => {
  const assignment = await assignmentModel.getAssignmentById(id, studentId);
  if (!assignment) {
    throw createError("Assignment not found", 404);
  }
  return assignment;
};

export default {
  getAssignments,
  getAssignment,
};
