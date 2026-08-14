import * as deadlineModel from "../models/deadlineModel.js";
import { createError } from "../utils/assignmentHelpers.js";

export const getDeadlines = async (studentId) => {
  const deadlines = await deadlineModel.getDeadlines(studentId);
  return deadlines;
};

export const updateDeadline = async (assignmentId, payload) => {
  if (!assignmentId) {
    throw createError("Assignment id is required", 400);
  }

  const deadline = await deadlineModel.updateDeadline(assignmentId, payload);
  if (!deadline) {
    throw createError("Deadline could not be updated", 500);
  }
  return deadline;
};

export default {
  getDeadlines,
  updateDeadline,
};
