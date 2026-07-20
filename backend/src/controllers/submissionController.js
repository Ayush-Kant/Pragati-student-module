// submissionController.js
import * as submissionService from "../services/submissionService.js";
import * as submissionModel from "../models/submissionModel.js";
import { formatSuccess, formatError } from "../utils/projectHelpers.js";

/**
 * Handles POST /api/student/projects/:projectId/submit
 */
export const submitFinalProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { githubUrl, deployedUrl } = req.body;
    const studentId = req.user?.id;

    if (!studentId) {
      return res.status(401).json(formatError("Unauthorized: Student credentials missing."));
    }

    // 1. Upload Capstone report file to S3 (or fallback)
    if (!req.file) {
      return res.status(400).json(formatError("Validation failed", { report: "Report PDF file is required." }));
    }

    const reportUrl = await submissionService.uploadProjectReport(req.file);

    // 2. Submit final project details
    const submission = await submissionService.submitFinalProject(
      Number(projectId),
      studentId,
      githubUrl,
      deployedUrl,
      reportUrl
    );

    return res.status(200).json(formatSuccess("Final project submitted successfully", submission));
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json(formatError(err.message, err.details || {}));
  }
};

/**
 * Handles GET /api/student/projects/:projectId/submission
 */
export const getSubmission = async (req, res) => {
  try {
    const { projectId } = req.params;
    const studentId = req.user?.id;

    if (!studentId) {
      return res.status(401).json(formatError("Unauthorized: Student credentials missing."));
    }

    const submission = await submissionModel.getSubmission(Number(projectId), studentId);
    if (!submission) {
      return res.status(404).json(formatError("No submission found for this project."));
    }

    return res.status(200).json(formatSuccess("Submission retrieved successfully", submission));
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json(formatError(err.message, err.details || {}));
  }
};

export default {
  submitFinalProject,
  getSubmission
};
