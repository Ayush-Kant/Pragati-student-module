/**
 * Location: backend/validators/collegeReports.validator.js
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

export const validateExportRequest = (req, res, next) => {
  // Determine format from URL path (/export/pdf -> pdf, /export/excel -> excel)
  // or query parameter
  const format = req.path.includes("pdf")
    ? "pdf"
    : req.path.includes("excel")
      ? "excel"
      : req.query.format;
  const { reportType } = req.query;

  if (!format || !["pdf", "excel"].includes(format.toLowerCase())) {
    return res.status(400).json({
      success: false,
      error: "Invalid export format. Must be 'pdf' or 'excel'.",
    });
  }

  if (reportType) {
    const validTypes = [
      "dashboard",
      "placements",
      "companies",
      "departments",
      "students",
    ];
    if (!validTypes.includes(reportType.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: `Invalid reportType. Must be one of: ${validTypes.join(", ")}`,
      });
    }
  }

  next();
};

export const validateFilters = (req, res, next) => {
  const { month, year } = req.query;

  if (month && !/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({
      success: false,
      error: "Invalid month format. Must be YYYY-MM (e.g. 2026-07).",
    });
  }

  if (year) {
    const parsedYear = parseInt(year, 10);
    if (isNaN(parsedYear) || parsedYear < 2000 || parsedYear > 2100) {
      return res.status(400).json({
        success: false,
        error: "Invalid year. Must be between 2000 and 2100.",
      });
    }
  }

  next();
};

export default {
  sanitizeInput,
  validateExportRequest,
  validateFilters,
};
