/**
 * Location:
 * backend/validators/collegeNotifications.validator.js
 */

const TITLE_REGEX = /^[A-Za-z][A-Za-z0-9&.,'()\- ]{2,149}$/;

export const validateNotification = (req, res, next) => {
  const {
    announcement_id,
    title,
    message,
    audience,
  } = req.body || {};

  if (!Number.isInteger(Number(announcement_id))) {
    return res.status(400).json({
      error: "announcement_id is required.",
    });
  }

  if (!title || typeof title !== "string") {
    return res.status(400).json({
      error: "Title is required.",
    });
  }

  if (!TITLE_REGEX.test(title.trim())) {
    return res.status(400).json({
      error: "Invalid notification title.",
    });
  }

  if (!message || typeof message !== "string") {
    return res.status(400).json({
      error: "Message is required.",
    });
  }

  if (!audience || typeof audience !== "string") {
    return res.status(400).json({
      error: "Audience is required.",
    });
  }

  next();
};

export const validateNotificationUpdate = (
  req,
  res,
  next
) => {
  const {
    title,
    message,
    audience,
    status,
  } = req.body || {};

  if (
    title !== undefined &&
    !TITLE_REGEX.test(title.trim())
  ) {
    return res.status(400).json({
      error: "Invalid title.",
    });
  }

  if (
    message !== undefined &&
    typeof message !== "string"
  ) {
    return res.status(400).json({
      error: "Invalid message.",
    });
  }

  if (
    audience !== undefined &&
    typeof audience !== "string"
  ) {
    return res.status(400).json({
      error: "Invalid audience.",
    });
  }

  if (
    status !== undefined &&
    !["Pending", "Sent"].includes(status)
  ) {
    return res.status(400).json({
      error:
        "Status must be Pending or Sent.",
    });
  }

  next();
};

export default {
  validateNotification,
  validateNotificationUpdate,
};