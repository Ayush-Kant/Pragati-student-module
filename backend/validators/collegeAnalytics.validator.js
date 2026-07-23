/**
 * Location: backend/validators/collegeAnalytics.validator.js
 */

export const sanitizeInput = (req, res, next) => {
  if (req.query && typeof req.query === "object") {
    for (const key of Object.keys(req.query)) {
      if (typeof req.query[key] === "string") {
        req.query[key] = req.query[key].trim().replace(/[<>]/g, "");
      }
    }
  }
  next();
};

export const validateAnalyticsRequest = (req, res, next) => {
  // Common check for any analytics parameters
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

export const validateFilters = (req, res, next) => {
  const { limit, page } = req.query;

  if (limit !== undefined) {
    const parsedLimit = parseInt(limit, 10);
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      return res
        .status(400)
        .json({ success: false, error: "Limit must be a positive integer." });
    }
  }

  if (page !== undefined) {
    const parsedPage = parseInt(page, 10);
    if (isNaN(parsedPage) || parsedPage <= 0) {
      return res
        .status(400)
        .json({ success: false, error: "Page must be a positive integer." });
    }
  }

  next();
};

export default {
  sanitizeInput,
  validateAnalyticsRequest,
  validateDateRange,
  validateFilters,
};
