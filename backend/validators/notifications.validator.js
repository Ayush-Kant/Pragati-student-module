const VALID_TYPES = ["info", "success", "warning", "alert"];

export const validateSendNotification = (req, res, next) => {
  const { userIds, title, message, type, role } = req.body;

  if (!role && (!userIds || !Array.isArray(userIds) || userIds.length === 0)) {
    return res
      .status(400)
      .json({
        success: false,
        error: "Provide either userIds (array) or role (string like 'student')",
      });
  }

  if (role && typeof role !== "string") {
    return res
      .status(400)
      .json({ success: false, error: "role must be a string" });
  }

  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, error: "title is required" });
  }

  if (!message || !message.trim()) {
    return res
      .status(400)
      .json({ success: false, error: "message is required" });
  }

  if (type && !VALID_TYPES.includes(type)) {
    return res
      .status(400)
      .json({
        success: false,
        error: `type must be one of: ${VALID_TYPES.join(", ")}`,
      });
  }

  next();
};

export const validateMarkAsRead = (req, res, next) => {
  const { notificationIds, markAll } = req.body;

  if (
    !markAll &&
    (!notificationIds ||
      !Array.isArray(notificationIds) ||
      notificationIds.length === 0)
  ) {
    return res.status(400).json({
      success: false,
      error: "Provide either notificationIds (array) or markAll (true)",
    });
  }

  if (
    notificationIds &&
    !notificationIds.every((id) => Number.isInteger(id) || !isNaN(parseInt(id)))
  ) {
    return res
      .status(400)
      .json({
        success: false,
        error: "notificationIds must contain valid integers",
      });
  }

  next();
};

export const validateGetNotifications = (req, res, next) => {
  const { page, limit } = req.query;

  if (page && (isNaN(page) || parseInt(page) < 1)) {
    return res
      .status(400)
      .json({ success: false, error: "page must be a positive integer" });
  }

  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    return res
      .status(400)
      .json({ success: false, error: "limit must be between 1 and 100" });
  }

  next();
};
