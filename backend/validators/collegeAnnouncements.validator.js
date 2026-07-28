/**
 * Location:
 * backend/validators/collegeAnnouncements.validator.js
 */

const TITLE_REGEX = /^[A-Za-z0-9][A-Za-z0-9&.,'()\-:!?/" ]{2,149}$/;

export const validateAnnouncement = (req, res, next) => {
  const {
    title,
    description,
    category_id,
    created_by,
  } = req.body || {};

  if (!title || typeof title !== "string") {
    return res.status(400).json({
      error: "Title is required.",
    });
  }

  if (!TITLE_REGEX.test(title.trim())) {
    return res.status(400).json({
      error:
        "Title must be 3-150 characters and start with a letter.",
    });
  }

  if (
    !description ||
    typeof description !== "string"
  ) {
    return res.status(400).json({
      error: "Description is required.",
    });
  }

 

  if (
    !Number.isInteger(Number(created_by))
  ) {
    return res.status(400).json({
      error: "created_by must be a valid integer.",
    });
  }

  next();
};

export const validateAnnouncementUpdate = (
  req,
  res,
  next
) => {
  const {
    title,
    description,
    category_id,
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
    description !== undefined &&
    typeof description !== "string"
  ) {
    return res.status(400).json({
      error: "Invalid description.",
    });
  }

  if (
    category_id !== undefined &&
    !Number.isInteger(Number(category_id))
  ) {
    return res.status(400).json({
      error: "Invalid category_id.",
    });
  }

  if (
    status !== undefined &&
    !["Draft", "Published"].includes(status)
  ) {
    return res.status(400).json({
      error:
        "Status must be Draft or Published.",
    });
  }

  next();
};

export default {
  validateAnnouncement,
  validateAnnouncementUpdate,
};