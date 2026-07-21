// milestoneService.js
import * as milestoneModel from "../models/milestoneModel.js";
import * as projectModel from "../models/projectModel.js";
import { isDeadlinePassed } from "../utils/deadlineHelpers.js";

/**
 * Fetches all milestones for a project.
 * @param {number} projectId 
 * @returns {Promise<Array>}
 */
export const getMilestones = async (projectId) => {
  // Validate project exists
  const project = await projectModel.getProjectById(projectId);
  if (!project) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }
  return milestoneModel.getMilestones(projectId);
};

/**
 * Submits milestone progress for an assigned student.
 * @param {number} projectId 
 * @param {number} milestoneId 
 * @param {number} studentId 
 * @param {string} githubUrl 
 * @param {string} deployedUrl 
 * @returns {Promise<object>}
 */
export const submitMilestone = async (projectId, milestoneId, studentId, githubUrl, deployedUrl) => {
  // 1. Verify project exists
  const project = await projectModel.getProjectById(projectId);
  if (!project) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }

  // 2. Verify milestone exists and belongs to this project
  const milestone = await milestoneModel.getMilestoneById(milestoneId);
  if (!milestone || Number(milestone.projectId) !== Number(projectId)) {
    const error = new Error("Milestone not found or does not belong to this project");
    error.status = 404;
    throw error;
  }

  // 3. Verify student is assigned to this project (delegated to model layer)
  const isAssigned = await projectModel.checkStudentProjectAssignment(projectId, studentId);
  if (!isAssigned) {
    const error = new Error("Unauthorized: Student is not assigned to this project");
    error.status = 403;
    throw error;
  }

  // 4. Verify deadline has not passed
  if (isDeadlinePassed(milestone.dueAt)) {
    const error = new Error("Submission failed: Milestone deadline has passed");
    error.status = 400;
    throw error;
  }

  // 5. Submit the milestone — ON CONFLICT DO UPDATE in the model allows
  //    idempotent re-submissions, so no duplicate guard is needed here.
  return milestoneModel.submitMilestone(projectId, milestoneId, studentId, githubUrl, deployedUrl);
};

export default {
  getMilestones,
  submitMilestone
};
