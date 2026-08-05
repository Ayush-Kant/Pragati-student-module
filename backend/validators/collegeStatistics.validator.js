/**
 * Location: backend/validators/collegeStatistics.validator.js
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

export const validateFilters = (req, res, next) => {
  const { year, semester } = req.query;

  if (year !== undefined) {
    const parsedYear = parseInt(year, 10);
    if (isNaN(parsedYear) || parsedYear < 2000 || parsedYear > 2100) {
      return res.status(400).json({
        success: false,
        error: "Invalid year parameter. Must be between 2000 and 2100.",
      });
    }
  }

  if (semester !== undefined) {
    const parsedSem = parseInt(semester, 10);
    if (isNaN(parsedSem) || parsedSem < 1 || parsedSem > 12) {
      return res.status(400).json({
        success: false,
        error: "Invalid semester parameter. Must be between 1 and 12.",
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
      return res
        .status(400)
        .json({ success: false, error: "Invalid startDate format." });
    }
  }

  if (endDate) {
    const end = new Date(endDate);
    if (isNaN(end.getTime())) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid endDate format." });
    }
  }

  next();
};

export default {
  sanitizeInput,
  validateFilters,
  validateDateRange,
};
