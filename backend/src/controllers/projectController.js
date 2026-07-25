// ─────────────────────────────────────────────────────────────────────────────
//  src/controllers/projectController.js
//  HTTP request handlers — delegates to ProjectService
// ─────────────────────────────────────────────────────────────────────────────

import projectService from "../services/projectService.js";
import { successResponse, errorResponse } from "../utils/projectHelpers.js";

/**
 * GET /api/student/projects/:projectId
 * Fetch full project details (milestones + submissions) for the logged-in student
 */
export const getProjectDetails = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const { projectId } = req.params;

    const data = await projectService.fetchProjectDetails(studentId, projectId);

    return successResponse(res, data, "Project details fetched successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/student/projects/:projectId/milestones/:milestoneId/submit
 * Submit a milestone entry (GitHub URL, deployment URL, progress notes)
 */
export const submitMilestone = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const { projectId, milestoneId } = req.params;

    const data = await projectService.createMilestoneSubmission(
      studentId,
      projectId,
      milestoneId,
      req.body
    );

    return successResponse(res, data, "Milestone submitted successfully", 201);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/student/projects/:projectId/submit
 * Submit the final project (GitHub URL, deployment URL, optional PDF report)
 */
export const submitFinalProject = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const { projectId } = req.params;

    const data = await projectService.createFinalSubmission(
      studentId,
      projectId,
      req.body,
      req.file || null
    );

    return successResponse(res, data, "Final project submitted successfully", 201);
  } catch (error) {
    next(error);
  }
};

export default {
  getProjectDetails,
  submitMilestone,
  submitFinalProject,
};
