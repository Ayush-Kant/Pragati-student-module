// milestoneController.js
import * as milestoneService from "../services/milestoneService.js";
import { formatSuccess, formatError } from "../utils/projectHelpers.js";

/**
 * Handles POST /api/student/projects/:projectId/milestones/:milestoneId
 */
export const submitMilestone = async (req, res, next) => {
  try {
    const { projectId, milestoneId } = req.params;
    const { githubUrl, deployedUrl } = req.body;
    const studentId = req.user?.id;

    if (!studentId) {
      return res.status(401).json(formatError("Unauthorized: Student credentials missing."));
    }

    const submission = await milestoneService.submitMilestone(
      Number(projectId),
      Number(milestoneId),
      studentId,
      githubUrl,
      deployedUrl
    );

    return res.status(200).json(formatSuccess("Milestone submitted successfully", submission));
  } catch (err) {
    next(err);
  }
};

/**
 * Handles GET /api/student/projects/:projectId/milestones
 */
export const getMilestones = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const milestones = await milestoneService.getMilestones(Number(projectId));
    return res.status(200).json(formatSuccess("Milestones retrieved successfully", { milestones }));
  } catch (err) {
    next(err);
  }
};

export default {
  submitMilestone,
  getMilestones
};
