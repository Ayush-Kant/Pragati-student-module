import {
  ANNOUNCEMENT_PRIORITIES,
  ANNOUNCEMENT_TARGET_AUDIENCES,
  ANNOUNCEMENT_TYPES,
  ANNOUNCEMENT_VISIBILITIES,
} from "../constants/collegeCommunication.constants.js";

const TITLE_REGEX = /^[A-Za-z0-9][A-Za-z0-9&.,'()\-:!?/" ]{2,149}$/;

export const validateAnnouncement = (req, res, next) => {
  const {
    title,
    description,
    category_id,
    created_by,
    priority,
    target_audience,
    announcement_type,
    visibility,
  } = req.body || {};

  // Title Validation
  if (!title || typeof title !== "string") {
    return res.status(400).json({
      success: false,
      message: "Title is required.",
      data: null,
    });
  }

  if (!TITLE_REGEX.test(title.trim())) {
    return res.status(400).json({
      success: false,
      message: "Title must be 3-150 characters and start with an alphanumeric character.",
      data: null,
    });
  }

  // Description Validation (B4: 3 to 5000 characters)
  if (!description || typeof description !== "string") {
    return res.status(400).json({
      success: false,
      message: "Description is required.",
      data: null,
    });
  }

  const descTrimmed = description.trim();
  if (descTrimmed.length < 3 || descTrimmed.length > 5000) {
    return res.status(400).json({
      success: false,
      message: "Description must be between 3 and 5000 characters.",
      data: null,
    });
  }

  // Optional Category ID check
  if (category_id !== undefined && category_id !== null && !Number.isInteger(Number(category_id))) {
    return res.status(400).json({
      success: false,
      message: "Category ID must be a valid integer.",
      data: null,
    });
  }

  // Enum Validations (B4)
  if (priority !== undefined && !ANNOUNCEMENT_PRIORITIES.includes(priority)) {
    return res.status(400).json({
      success: false,
      message: `Invalid priority. Allowed values: ${ANNOUNCEMENT_PRIORITIES.join(", ")}`,
      data: null,
    });
  }

  if (target_audience !== undefined && !ANNOUNCEMENT_TARGET_AUDIENCES.includes(target_audience)) {
    return res.status(400).json({
      success: false,
      message: `Invalid target_audience. Allowed values: ${ANNOUNCEMENT_TARGET_AUDIENCES.join(", ")}`,
      data: null,
    });
  }

  if (announcement_type !== undefined && !ANNOUNCEMENT_TYPES.includes(announcement_type)) {
    return res.status(400).json({
      success: false,
      message: `Invalid announcement_type. Allowed values: ${ANNOUNCEMENT_TYPES.join(", ")}`,
      data: null,
    });
  }

  if (visibility !== undefined && !ANNOUNCEMENT_VISIBILITIES.includes(visibility)) {
    return res.status(400).json({
      success: false,
      message: `Invalid visibility. Allowed values: ${ANNOUNCEMENT_VISIBILITIES.join(", ")}`,
      data: null,
    });
  }

  next();
};

export const validateAnnouncementUpdate = (req, res, next) => {
  const {
    title,
    description,
    category_id,
    status,
    priority,
    target_audience,
    announcement_type,
    visibility,
  } = req.body || {};

  if (title !== undefined && (!title || typeof title !== "string" || !TITLE_REGEX.test(title.trim()))) {
    return res.status(400).json({
      success: false,
      message: "Invalid title format.",
      data: null,
    });
  }

  if (description !== undefined) {
    if (typeof description !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid description.",
        data: null,
      });
    }
    const descTrimmed = description.trim();
    if (descTrimmed.length < 3 || descTrimmed.length > 5000) {
      return res.status(400).json({
        success: false,
        message: "Description must be between 3 and 5000 characters.",
        data: null,
      });
    }
  }

  if (category_id !== undefined && category_id !== null && !Number.isInteger(Number(category_id))) {
    return res.status(400).json({
      success: false,
      message: "Invalid category_id.",
      data: null,
    });
  }

  if (status !== undefined && !["Draft", "Published"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Status must be Draft or Published.",
      data: null,
    });
  }

  // Enum Validations for update (B4)
  if (priority !== undefined && !ANNOUNCEMENT_PRIORITIES.includes(priority)) {
    return res.status(400).json({
      success: false,
      message: `Invalid priority. Allowed values: ${ANNOUNCEMENT_PRIORITIES.join(", ")}`,
      data: null,
    });
  }

  if (target_audience !== undefined && !ANNOUNCEMENT_TARGET_AUDIENCES.includes(target_audience)) {
    return res.status(400).json({
      success: false,
      message: `Invalid target_audience. Allowed values: ${ANNOUNCEMENT_TARGET_AUDIENCES.join(", ")}`,
      data: null,
    });
  }

  if (announcement_type !== undefined && !ANNOUNCEMENT_TYPES.includes(announcement_type)) {
    return res.status(400).json({
      success: false,
      message: `Invalid announcement_type. Allowed values: ${ANNOUNCEMENT_TYPES.join(", ")}`,
      data: null,
    });
  }

  if (visibility !== undefined && !ANNOUNCEMENT_VISIBILITIES.includes(visibility)) {
    return res.status(400).json({
      success: false,
      message: `Invalid visibility. Allowed values: ${ANNOUNCEMENT_VISIBILITIES.join(", ")}`,
      data: null,
    });
  }

  next();
};

export default {
  validateAnnouncement,
  validateAnnouncementUpdate,
};