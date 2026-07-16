import submissionModel from "../models/submissionModel.js";
import assignmentModel from "../models/assignmentModel.js";

export const submitAssignment = async (studentId, assignmentId, payload) => {
  const assignment = await assignmentModel.getAssignmentById(assignmentId);
  if (!assignment) {
    const error = new Error("Assignment not found");
    error.status = 404;
    throw error;
  }
  return await submissionModel.submitAssignment(studentId, assignmentId, payload);
};

export const updateSubmission = async (studentId, assignmentId, payload) => {
  const assignment = await assignmentModel.getAssignmentById(assignmentId);
  if (!assignment) {
    const error = new Error("Assignment not found");
    error.status = 404;
    throw error;
  }
  return await submissionModel.updateSubmission(studentId, assignmentId, payload);
};

export const getSubmissionHistory = async (studentId, assignmentId) => {
  const assignment = await assignmentModel.getAssignmentById(assignmentId);
  if (!assignment) {
    const error = new Error("Assignment not found");
    error.status = 404;
    throw error;
  }
  return await submissionModel.getSubmissionHistory(studentId, assignmentId);
};

export default { submitAssignment, updateSubmission, getSubmissionHistory };
