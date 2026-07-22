// projectValidator.js

/**
 * Middleware to validate project ID parameter.
 */
export const validateProject = (req, res, next) => {
  const { projectId } = req.params;
  const idNum = Number(projectId);

  if (!projectId || !Number.isInteger(idNum) || idNum <= 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: { projectId: "Invalid project ID. Must be a positive integer." }
    });
  }

  next();
};

export default {
  validateProject
};
