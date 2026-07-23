export const validateUpdateProfile = (req, res, next) => {
  const { bio, expertiseTags, avatarUrl, availabilityJson } = req.body;

  if (bio && typeof bio !== "string") {
    return res.status(400).json({
      success: false,
      message: "Bio must be a string",
    });
  }

  if (expertiseTags && !Array.isArray(expertiseTags)) {
    return res.status(400).json({
      success: false,
      message: "Expertise tags must be an array",
    });
  }

  if (avatarUrl && typeof avatarUrl !== "string") {
    return res.status(400).json({
      success: false,
      message: "Avatar URL must be a string",
    });
  }

  if (availabilityJson && typeof availabilityJson !== "object") {
    return res.status(400).json({
      success: false,
      message: "Availability must be an object",
    });
  }

  next();
};
