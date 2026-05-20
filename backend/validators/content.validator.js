export const validateCreateCourse = (req, res, next) => {
  const { title, skillTags, driveId } = req.body;

  if (!title || title.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: "Title must be at least 3 characters",
    });
  }

  if (!Array.isArray(skillTags) || skillTags.length < 1) {
    return res.status(400).json({
      success: false,
      message: "At least one skill tag is required",
    });
  }

  if (!driveId) {
    return res.status(400).json({
      success: false,
      message: "driveId is required",
    });
  }

  next();
};
