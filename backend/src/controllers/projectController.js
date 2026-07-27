// ─────────────────────────────────────────────────────────────────────────────
//  src/controllers/projectController.js
//  HTTP request handlers — delegates to ProjectService
// ─────────────────────────────────────────────────────────────────────────────

import projectService from "../services/projectService.js";
import { normalizeStudentId } from "../utils/assignmentHelpers.js";

/**
 * GET /api/student/projects/:projectId
 * Fetch full project details (milestones + submissions) for the logged-in student
 */
export const getProjectDetails = async (req, res, next) => {
  try {
    const studentId = normalizeStudentId(req);
    const { projectId } = req.params;

    const data = await projectService.fetchProjectDetails(studentId, projectId);

    res.status(200).json({
      success: true,
      message: "Project details fetched successfully",
      data,
    });
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
    const studentId = normalizeStudentId(req);
    const { projectId, milestoneId } = req.params;

    const data = await projectService.createMilestoneSubmission(
      studentId,
      projectId,
      milestoneId,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Milestone submitted successfully",
      data,
    });
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
    const studentId = normalizeStudentId(req);
    const { projectId } = req.params;

    const data = await projectService.createFinalSubmission(
      studentId,
      projectId,
      req.body,
      req.file || null
    );

    res.status(201).json({
      success: true,
      message: "Final project submitted successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getProjectDetails,
  submitMilestone,
  submitFinalProject,
};
