// projectService.js
import * as projectModel from "../models/projectModel.js";

/**
 * Fetches basic project details.
 * @param {number} projectId 
 * @returns {Promise<object>}
 */
export const getProject = async (projectId) => {
  const project = await projectModel.getProjectById(projectId);
  if (!project) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }
  return project;
};

/**
 * Fetches detailed project stats, milestones, and student status.
 * @param {number} projectId 
 * @param {number} studentId 
 * @returns {Promise<object>}
 */
export const getProjectDetails = async (projectId, studentId) => {
  const details = await projectModel.getProjectDetails(projectId, studentId);
  if (!details) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }
  return details;
};

export default {
  getProject,
  getProjectDetails
};
