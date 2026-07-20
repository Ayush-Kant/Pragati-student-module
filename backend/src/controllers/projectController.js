// projectController.js
import * as projectService from "../services/projectService.js";
import { formatSuccess, formatError } from "../utils/projectHelpers.js";

/**
 * Handles GET /api/student/projects/:projectId
 */
export const getProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;
    const studentId = req.user?.id;

    if (!studentId) {
      return res.status(401).json(formatError("Unauthorized: Student credentials missing."));
    }

    const details = await projectService.getProjectDetails(Number(projectId), studentId);
    
    return res.status(200).json(formatSuccess("Project details retrieved successfully", details));
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json(formatError(err.message, err.details || {}));
  }
};

export default {
  getProjectDetails
};
