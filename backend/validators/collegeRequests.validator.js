/**
 * Location: backend/validators/collegeRequests.validator.js
 *
 * General-purpose request validators for college analytics endpoints.
 */

export const sanitizeInput = (req, res, next) => {
  const sources = [req.query, req.body, req.params];
  for (const source of sources) {
    if (!source || typeof source !== "object") continue;
    for (const key of Object.keys(source)) {
      if (typeof source[key] === "string") {
        source[key] = source[key].trim().replace(/[<>]/g, "");
      }
    }
  }
  next();
};

export const validateIdParam = (req, res, next) => {
  const { id } = req.params;
  if (id !== undefined) {
    const parsed = Number(id);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ID parameter." });
    }
  }
  next();
};

export const validateRequestId = validateIdParam;

export const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;

  if (page !== undefined) {
    const parsed = parseInt(page, 10);
    if (isNaN(parsed) || parsed <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Page must be a positive integer." });
    }
  }

  if (limit !== undefined) {
    const parsed = parseInt(limit, 10);
    if (isNaN(parsed) || parsed <= 0 || parsed > 100) {
      return res.status(400).json({
        success: false,
        message: "Limit must be a positive integer up to 100.",
      });
    }
  }

  next();
};

export const validateDateRange = (req, res, next) => {
  const { startDate, endDate } = req.query;

  if (startDate) {
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Invalid startDate format. Use YYYY-MM-DD.",
      });
    }
  }

  if (endDate) {
    const end = new Date(endDate);
    if (isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Invalid endDate format. Use YYYY-MM-DD.",
      });
    }
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      return res
        .status(400)
        .json({ success: false, error: "startDate cannot be after endDate." });
    }
  }

  next();
};

export const validateRequiredFields = (fields) => (req, res, next) => {
  const missing = fields.filter(
    (field) => req.body[field] === undefined || req.body[field] === null || req.body[field] === "",
  );
  if (missing.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing required fields: ${missing.join(", ")}`,
    });
  }
  next();
};

export default {
  sanitizeInput,
  validateIdParam,
  validateRequestId,
  validatePagination,
  validateDateRange,
  validateRequiredFields,
};
