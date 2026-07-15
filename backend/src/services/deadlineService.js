import deadlineModel from "../models/deadlineModel.js";

export const getDeadlines = async (query = {}) => {
  return await deadlineModel.getDeadlines(query);
};

export const updateDeadline = async (assignmentId, payload) => {
  return await deadlineModel.updateDeadline(assignmentId, payload);
};

export default { getDeadlines, updateDeadline };
