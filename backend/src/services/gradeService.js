import gradeModel from "../models/gradeModel.js";

export const getGrades = async (query = {}) => {
  return await gradeModel.getGrades(query);
};

export const updateGrades = async (assignmentId, payload) => {
  return await gradeModel.updateGrades(assignmentId, payload);
};

export default { getGrades, updateGrades };
