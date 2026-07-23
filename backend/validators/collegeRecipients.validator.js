/**
 * Location:
 * backend/validators/collegeRecipients.validator.js
 */

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRecipient = (
  req,
  res,
  next
) => {
  const {
    recipient_name,
    recipient_email,
  } = req.body || {};

  if (
    !recipient_name ||
    typeof recipient_name !== "string"
  ) {
    return res.status(400).json({
      error: "Recipient name is required.",
    });
  }

  if (
    !recipient_email ||
    typeof recipient_email !== "string"
  ) {
    return res.status(400).json({
      error: "Recipient email is required.",
    });
  }

  if (
    !EMAIL_REGEX.test(recipient_email.trim())
  ) {
    return res.status(400).json({
      error: "Invalid email address.",
    });
  }

  next();
};

export const validateRecipientUpdate = (
  req,
  res,
  next
) => {
  const {
    recipient_name,
    recipient_email,
    status,
  } = req.body || {};

  if (
    recipient_name !== undefined &&
    typeof recipient_name !== "string"
  ) {
    return res.status(400).json({
      error: "Invalid recipient name.",
    });
  }

  if (
    recipient_email !== undefined &&
    !EMAIL_REGEX.test(recipient_email.trim())
  ) {
    return res.status(400).json({
      error: "Invalid recipient email.",
    });
  }

  if (
    status !== undefined &&
    !["Pending", "Delivered", "Failed"].includes(status)
  ) {
    return res.status(400).json({
      error:
        "Status must be Pending, Delivered or Failed.",
    });
  }

  next();
};

export default {
  validateRecipient,
  validateRecipientUpdate,
};