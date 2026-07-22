// feedbackController.js
import * as feedbackService from "../services/feedbackService.js";
import { formatSuccess, formatError } from "../utils/projectHelpers.js";

/**
 * Handles GET /api/student/projects/:projectId/feedback
 */
export const getFeedback = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const studentId = req.user?.id;

    if (!studentId) {
      return res.status(401).json(formatError("Unauthorized: Student credentials missing."));
    }

    const feedbackReport = await feedbackService.getFeedback(Number(projectId), studentId);
    
    return res.status(200).json(formatSuccess("Project feedback retrieved successfully", feedbackReport));
  } catch (err) {
    next(err);
  }
};

export default {
  getFeedback
};
