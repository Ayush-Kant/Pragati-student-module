import * as feedbackModel from "../models/feedbackModel.js";
import { createError } from "../utils/assignmentHelpers.js";

export const getFeedback = async (assignmentId, studentId) => {
  const feedback = await feedbackModel.getFeedback(assignmentId, studentId);
  if (!feedback) {
    throw createError("Feedback not found", 404);
  }
  return feedback;
};

export const addFeedback = async (assignmentId, studentId, payload) => {
  const feedback = await feedbackModel.addFeedback(assignmentId, studentId, payload);
  return feedback;
};

export default {
  getFeedback,
  addFeedback,
};
