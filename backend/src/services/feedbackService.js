import feedbackModel from "../models/feedbackModel.js";

export const getFeedback = async (assignmentId) => {
  return await feedbackModel.getFeedback(assignmentId);
};

export const addFeedback = async (assignmentId, payload) => {
  return await feedbackModel.addFeedback(assignmentId, payload);
};

export default { getFeedback, addFeedback };
