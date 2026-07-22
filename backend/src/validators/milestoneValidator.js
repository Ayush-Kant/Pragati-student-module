// milestoneValidator.js
import { validateGithubURL, validateDeployedURL } from "./submissionValidator.js";

/**
 * Middleware to validate milestone parameter and submit payload.
 */
export const validateMilestone = (req, res, next) => {
  const { projectId, milestoneId } = req.params;
  const { githubUrl, deployedUrl } = req.body;

  const projIdNum = Number(projectId);
  const mileIdNum = Number(milestoneId);

  // 1. Validate URL Parameters
  const errors = {};
  if (!projectId || !Number.isInteger(projIdNum) || projIdNum <= 0) {
    errors.projectId = "Invalid project ID. Must be a positive integer.";
  }
  if (!milestoneId || !Number.isInteger(mileIdNum) || mileIdNum <= 0) {
    errors.milestoneId = "Invalid milestone ID. Must be a positive integer.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: errors
    });
  }

  // 2. Validate Request Body
  if (!githubUrl) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: { githubUrl: "GitHub URL is required." }
    });
  }

  if (!validateGithubURL(githubUrl)) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: { githubUrl: "Invalid GitHub repository URL format. Must start with https://github.com/" }
    });
  }

  if (deployedUrl && !validateDeployedURL(deployedUrl)) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: { deployedUrl: "Invalid Deployed URL. Must be an HTTPS link starting with https://" }
    });
  }

  next();
};

export default {
  validateMilestone
};
