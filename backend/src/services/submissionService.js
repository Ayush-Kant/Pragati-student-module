// submissionService.js
import * as submissionModel from "../models/submissionModel.js";
import * as projectModel from "../models/projectModel.js";
import { isDeadlinePassed } from "../utils/deadlineHelpers.js";
import { uploadToS3 } from "../utils/uploadHelpers.js";
import { pool } from "../../config/db.js";

/**
 * Validates a submission payload (business validation).
 * @param {number} projectId 
 * @param {number} studentId 
 * @returns {Promise<object>} The project details if valid
 */
export const validateSubmission = async (projectId, studentId) => {
  // 1. Verify project exists
  const project = await projectModel.getProjectById(projectId);
  if (!project) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }

  // 2. Verify student is assigned to this project
  const assignmentCheck = await pool.query(
    "SELECT id FROM student_projects WHERE project_id = $1 AND student_id = $2",
    [projectId, studentId]
  );
  if (assignmentCheck.rows.length === 0) {
    const error = new Error("Unauthorized: Student is not assigned to this project");
    error.status = 403;
    throw error;
  }

  // 3. Verify final deadline has not passed
  if (isDeadlinePassed(project.final_due_at)) {
    const error = new Error("Submission failed: Project final deadline has passed");
    error.status = 400;
    throw error;
  }

  return project;
};

/**
 * Handles the upload of the Capstone report PDF file.
 * @param {object} file 
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
 * Submits the final project details.
 * @param {number} projectId 
 * @param {number} studentId 
 * @param {string} githubUrl 
 * @param {string} deployedUrl 
 * @param {string} reportUrl 
 * @returns {Promise<object>} The created/updated submission record
 */
export const submitFinalProject = async (projectId, studentId, githubUrl, deployedUrl, reportUrl) => {
  // Run business validations
  await validateSubmission(projectId, studentId);

  // Verify final project has not already been submitted
  const existingSub = await submissionModel.getSubmission(projectId, studentId);
  if (existingSub) {
    const error = new Error("Submission failed: Final project has already been submitted");
    error.status = 400;
    throw error;
  }

  // Submit final project details (handled via model's ON CONFLICT)
  return submissionModel.submitFinalProject(projectId, studentId, githubUrl, deployedUrl, reportUrl);
};

export default {
  validateSubmission,
  uploadProjectReport,
  submitFinalProject
};
