// validators/course.validation.js

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

export const validateGetCourses = (req, res, next) => {
  const { status } = req.query;

  const validStatuses = ["draft", "published", "archived"];

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status filter",
    });
  }

  next();
};

export const validateUpdateCourse = (req, res, next) => {
  const { title, skillTags, status } = req.body;

  const validStatuses = ["draft", "published", "archived"];

  if (title !== undefined && title.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: "Title must be at least 3 characters",
    });
  }

  if (
    skillTags !== undefined &&
    (!Array.isArray(skillTags) || skillTags.length < 1)
  ) {
    return res.status(400).json({
      success: false,
      message: "At least one skill tag is required",
    });
  }

  if (status !== undefined && !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Status must be draft, published, or archived",
    });
  }

  next();
};

export const validateAddModule = (req, res, next) => {
  const { title, orderIndex } = req.body;

  if (!title || title.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: "Title must be at least 3 characters",
    });
  }

  if (orderIndex === undefined || Number(orderIndex) < 0) {
    return res.status(400).json({
      success: false,
      message: "Valid orderIndex is required",
    });
  }

  next();
};
