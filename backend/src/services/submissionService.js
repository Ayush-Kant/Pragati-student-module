import submissionModel from "../models/submissionModel.js";
import assignmentModel from "../models/assignmentModel.js";
import { resolveAssignmentStudentId } from "../utils/assignmentHelpers.js";

export const submitAssignment = async (user, assignmentId, payload) => {
  const assignment = await assignmentModel.getAssignmentById(assignmentId);
  if (!assignment) {
    const error = new Error("Assignment not found");
    error.status = 404;
    throw error;
  }

  const studentId = await resolveAssignmentStudentId(user, payload?.studentId ?? null);
  return await submissionModel.submitAssignment(studentId, assignmentId, payload);
};

export const updateSubmission = async (user, assignmentId, payload) => {
  const assignment = await assignmentModel.getAssignmentById(assignmentId);
  if (!assignment) {
    const error = new Error("Assignment not found");
    error.status = 404;
    throw error;
  }

  const studentId = await resolveAssignmentStudentId(user, payload?.studentId ?? null);
  return await submissionModel.updateSubmission(studentId, assignmentId, payload);
};

export const getSubmissionHistory = async (user, assignmentId) => {
  const assignment = await assignmentModel.getAssignmentById(assignmentId);
  if (!assignment) {
    const error = new Error("Assignment not found");
    error.status = 404;
    throw error;
  }

  const studentId = await resolveAssignmentStudentId(user, null);
  return await submissionModel.getSubmissionHistory(studentId, assignmentId);
};

export default { submitAssignment, updateSubmission, getSubmissionHistory };
