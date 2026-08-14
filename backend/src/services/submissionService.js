import * as submissionModel from "../models/submissionModel.js";
import { createError } from "../utils/assignmentHelpers.js";

export const submitAssignment = async (assignmentId, studentId, payload) => {
  if (!assignmentId) {
    throw createError("Assignment id is required", 400);
  }

  const submission = await submissionModel.submitAssignment(assignmentId, studentId, payload);
  return submission;
};

export const updateSubmission = async (assignmentId, studentId, payload) => {
  const submission = await submissionModel.updateSubmission(assignmentId, studentId, payload);
  if (!submission) {
    throw createError("Submission not found", 404);
  }
  return submission;
};

export const getSubmissionHistory = async (assignmentId, studentId) => {
  const history = await submissionModel.getSubmissionHistory(assignmentId, studentId);
  return history;
};

export default {
  submitAssignment,
  updateSubmission,
  getSubmissionHistory,
};
