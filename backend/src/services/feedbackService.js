// feedbackService.js
import * as feedbackModel from "../models/feedbackModel.js";
import * as projectModel from "../models/projectModel.js";

/**
 * Gets grading feedback for a student's Capstone submission.
 * @param {number} projectId 
 * @param {number} studentId 
 * @returns {Promise<object>}
 */
export const getFeedback = async (projectId, studentId) => {
  // 1. Verify project exists
  const project = await projectModel.getProjectById(projectId);
  if (!project) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }

  // 2. Fetch the submission status
  const submission = await feedbackModel.getSubmissionStatus(projectId, studentId);
  if (!submission) {
    const error = new Error("Feedback not available: Project has not been submitted yet");
    error.status = 404;
    throw error;
  }

  // 3. Get feedback records for the submission
  const feedbackRecords = await feedbackModel.getFeedback(submission.id);

  const totalScore = feedbackRecords.reduce((sum, f) => sum + f.score, 0);
  const maxScore = feedbackRecords.reduce((sum, f) => sum + f.maxScore, 0);

  return {
    projectId,
    studentId,
    submissionId: submission.id,
    submittedAt: submission.submittedAt,
    status: submission.status,
    totalScore,
    maxScore,
    feedback: feedbackRecords
  };
};

/**
 * Gets rubric definitions for a project.
 * @param {number} projectId 
 * @returns {Promise<Array>}
 */
export const getRubric = async (projectId) => {
  const project = await projectModel.getProjectById(projectId);
  if (!project) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }
  return feedbackModel.getRubric(projectId);
};

export default {
  getFeedback,
  getRubric
};
