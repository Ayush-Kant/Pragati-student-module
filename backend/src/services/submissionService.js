import submissionModel from "../models/submissionModel.js";

export const submitAssignment = async (studentId, assignmentId, payload) => {
  return await submissionModel.submitAssignment(studentId, assignmentId, payload);
};

export const updateSubmission = async (studentId, assignmentId, payload) => {
  return await submissionModel.updateSubmission(studentId, assignmentId, payload);
};

export const getSubmissionHistory = async (studentId, assignmentId) => {
  return await submissionModel.getSubmissionHistory(studentId, assignmentId);
};

export default { submitAssignment, updateSubmission, getSubmissionHistory };
