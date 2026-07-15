import assignmentModel from "../models/assignmentModel.js";

export const getAssignments = async (query = {}) => {
  return await assignmentModel.getAllAssignments(query);
};

export const getAssignment = async (id) => {
  const assignment = await assignmentModel.getAssignmentById(id);
  if (!assignment) {
    const error = new Error("Assignment not found");
    error.status = 404;
    throw error;
  }
  return assignment;
};

export default { getAssignments, getAssignment };
