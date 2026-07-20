import feedbackModel from "../models/feedbackModel.js";
import assignmentModel from "../models/assignmentModel.js";
import { createAssignmentError, isInstructorOrAdmin } from "../utils/assignmentHelpers.js";

export const getFeedback = async (assignmentId, user) => {
  const assignment = await assignmentModel.getAssignmentById(assignmentId);
  if (!assignment) {
    const error = new Error("Assignment not found");
    error.status = 404;
    throw error;
  }
  return await feedbackModel.getFeedback(assignmentId, user);
};

export const addFeedback = async (assignmentId, payload, user) => {
  const assignment = await assignmentModel.getAssignmentById(assignmentId);
  if (!assignment) {
    const error = new Error("Assignment not found");
    error.status = 404;
    throw error;
  }

  if (!isInstructorOrAdmin(user)) {
    throw createAssignmentError("Access forbidden", 403);
  }

  return await feedbackModel.addFeedback(assignmentId, payload, user);
};

export default { getFeedback, addFeedback };
