// submissionController.js
import * as submissionService from "../services/submissionService.js";
import * as submissionModel from "../models/submissionModel.js";
import { formatSuccess, formatError } from "../utils/projectHelpers.js";

/**
 * Handles POST /api/student/projects/:projectId/submit
 *
 * Order of operations (Issue #1 fix):
 *   1. Validate all business rules FIRST (project exists, student assigned, deadline)
 *   2. Only upload the file AFTER validation succeeds
 * This prevents orphaned files being stored when validation later fails.
 */
export const submitFinalProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { githubUrl, deployedUrl } = req.body;
    const studentId = req.user?.id;

    if (!studentId) {
      return res.status(401).json(formatError("Unauthorized: Student credentials missing."));
    }

    if (!req.file) {
      return res.status(400).json(formatError("Validation failed", { report: "Report PDF file is required." }));
    }

    // 1. Run ALL business validations before touching storage
    //    (project exists · student assigned · deadline not passed)
    await submissionService.validateSubmission(Number(projectId), studentId);

    // 2. Upload only after every validation has passed
    const reportUrl = await submissionService.uploadProjectReport(req.file);

    // 3. Persist the submission record
    const submission = await submissionService.submitFinalProject(
      Number(projectId),
      studentId,
      githubUrl,
      deployedUrl,
      reportUrl
    );

    return res.status(200).json(formatSuccess("Final project submitted successfully", submission));
  } catch (err) {
    next(err);
  }
};

/**
 * Handles GET /api/student/projects/:projectId/submission
 */
export const getSubmission = async (req, res, next) => {
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
    next(err);
  }
};

/**
 * Handles PATCH /api/student/projects/:projectId/submission
 *
 * Issue #2 fix: deadline validation is applied to updates as well as creates.
 * Only whitelisted fields reach the SQL UPDATE statement (model-layer whitelist).
 */
export const updateSubmission = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const studentId = req.user?.id;

    if (!studentId) {
      return res.status(401).json(formatError("Unauthorized: Student credentials missing."));
    }

    // Run the same validation as create: project exists · student assigned · deadline
    await submissionService.validateSubmission(Number(projectId), studentId);

    // Confirm an existing submission exists before updating
    const existing = await submissionModel.getSubmission(Number(projectId), studentId);
    if (!existing) {
      return res.status(404).json(formatError("No submission found for this project."));
    }

    const updated = await submissionModel.updateSubmission(existing.id, req.body);
    return res.status(200).json(formatSuccess("Submission updated successfully", updated));
  } catch (err) {
    next(err);
  }
};

export default {
  submitFinalProject,
  getSubmission,
  updateSubmission
};
