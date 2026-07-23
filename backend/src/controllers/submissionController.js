import * as submissionService from "../services/submissionService.js";
import { normalizeStudentId } from "../utils/assignmentHelpers.js";

export const submitAssignment = async (req, res, next) => {
  try {
    const studentId = normalizeStudentId(req);
    const submission = await submissionService.submitAssignment(req.params.id, studentId, req.body);

    res.status(201).json({
      success: true,
      message: "Assignment submitted successfully",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubmission = async (req, res, next) => {
  try {
    const studentId = normalizeStudentId(req);
    const submission = await submissionService.updateSubmission(req.params.id, studentId, req.body);

    res.status(200).json({
      success: true,
      message: "Submission updated successfully",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubmissionHistory = async (req, res, next) => {
  try {
    const studentId = normalizeStudentId(req);
    const history = await submissionService.getSubmissionHistory(req.params.id, studentId);

    res.status(200).json({
      success: true,
      data: history,
      count: history.length,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  submitAssignment,
  updateSubmission,
  getSubmissionHistory,
};
