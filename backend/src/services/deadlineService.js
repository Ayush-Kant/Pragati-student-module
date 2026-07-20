import deadlineModel from "../models/deadlineModel.js";
import assignmentModel from "../models/assignmentModel.js";
import { createAssignmentError, isInstructorOrAdmin } from "../utils/assignmentHelpers.js";

export const getDeadlines = async (query = {}, user) => {
  return await deadlineModel.getDeadlines(query, user);
};

export const updateDeadline = async (assignmentId, payload, user) => {
  const assignment = await assignmentModel.getAssignmentById(assignmentId);
  if (!assignment) {
    const error = new Error("Assignment not found");
    error.status = 404;
    throw error;
  }

  if (!isInstructorOrAdmin(user)) {
    throw createAssignmentError("Access forbidden", 403);
  }

  return await deadlineModel.updateDeadline(assignmentId, payload, user);
};

export default { getDeadlines, updateDeadline };
