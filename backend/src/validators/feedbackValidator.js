// feedbackValidator.js

/**
 * Middleware to validate parameters for feedback requests.
 */
export const validateFeedback = (req, res, next) => {
  const { projectId } = req.params;
  const projIdNum = Number(projectId);

  if (!projectId || !Number.isInteger(projIdNum) || projIdNum <= 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: { projectId: "Invalid project ID. Must be a positive integer." }
    });
  }

  next();
};

export default {
  validateFeedback
};
