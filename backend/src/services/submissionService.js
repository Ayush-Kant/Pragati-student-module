// submissionService.js
//
// Service layer: pure business logic only.
// All database access is delegated to the model layer — no pool.query() here.
import * as submissionModel from "../models/submissionModel.js";
import * as projectModel from "../models/projectModel.js";
import { isDeadlinePassed } from "../utils/deadlineHelpers.js";
import { uploadToS3 } from "../utils/uploadHelpers.js";

/**
 * Validates a submission/update payload (business validation).
 * Called BEFORE any file upload or DB write so that failed validations
 * never leave orphaned files in storage.
 *
 * Checks (Issue #2 fix — applied identically for create AND update):
 *  1. Project exists
 *  2. Student is assigned to the project
 *  3. Final submission deadline has not passed
 *
 * @param {number} projectId
 * @param {number} studentId
 * @returns {Promise<object>} The project record if all checks pass
 */
export const validateSubmission = async (projectId, studentId) => {
  // 1. Verify project exists — delegated to model layer (no raw SQL here)
  const project = await projectModel.getProjectById(projectId);
  if (!project) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }

  // 2. Verify student is assigned to this project — delegated to model layer
  const isAssigned = await projectModel.checkStudentProjectAssignment(projectId, studentId);
  if (!isAssigned) {
    const error = new Error("Unauthorized: Student is not assigned to this project");
    error.status = 403;
    throw error;
  }

  // 3. Verify final deadline has not passed (guards both create and update)
  if (isDeadlinePassed(project.final_due_at)) {
    const error = new Error("Submission failed: Project final deadline has passed");
    error.status = 400;
    throw error;
  }

  return project;
};

/**
 * Handles the upload of the Capstone report PDF file.
 * Must only be called AFTER validateSubmission() succeeds (Issue #1 fix).
 *
 * @param {object} file  - multer file object (contains buffer)
 * @returns {Promise<string>} The uploaded file URL
 */
export const uploadProjectReport = async (file) => {
  if (!file) {
    const error = new Error("Validation failed: Report PDF file is required");
    error.status = 400;
    throw error;
  }
  return uploadToS3(file);
};

/**
 * Persists the final project submission record.
 * Business validations and file upload are performed by the controller
 * before calling this function.
 *
 * @param {number} projectId
 * @param {number} studentId
 * @param {string} githubUrl
 * @param {string} deployedUrl
 * @param {string} reportUrl
 * @returns {Promise<object>} The created/updated submission record
 */
export const submitFinalProject = async (projectId, studentId, githubUrl, deployedUrl, reportUrl) => {
  // No validation here — controller calls validateSubmission() first.
  // ON CONFLICT DO UPDATE in the model allows idempotent re-submissions.
  return submissionModel.submitFinalProject(projectId, studentId, githubUrl, deployedUrl, reportUrl);
};

export default {
  validateSubmission,
  uploadProjectReport,
  submitFinalProject
};
