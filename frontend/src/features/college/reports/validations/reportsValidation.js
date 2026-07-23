import { REPORT_TYPES } from "../constants/reportsConstants";

/**
 * Validates the inputs when generating a new report.
 * @param {Object} data - The report parameters form.
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateReport = (data) => {
  const errors = {};

  if (!data.reportName || !data.reportName.trim()) {
    errors.reportName = "Report Name is required.";
  } else if (data.reportName.trim().length < 3) {
    errors.reportName = "Report Name must be at least 3 characters.";
  }

  if (!data.type) {
    errors.type = "Report Type is required.";
  } else if (!REPORT_TYPES.includes(data.type)) {
    errors.type = "Invalid Report Type.";
  }

  if (!data.department) {
    errors.department = "Department selection is required.";
  }

  if (!data.company) {
    errors.company = "Company selection is required.";
  }

  if (!data.batch) {
    errors.batch = "Batch selection is required.";
  }

  if (!data.startDate) {
    errors.startDate = "Start date is required.";
  }

  if (!data.endDate) {
    errors.endDate = "End date is required.";
  }

  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (isNaN(start.getTime())) {
      errors.startDate = "Invalid start date.";
    }
    if (isNaN(end.getTime())) {
      errors.endDate = "Invalid end date.";
    }
    if (!errors.startDate && !errors.endDate && start > end) {
      errors.endDate = "End date cannot be earlier than start date.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates the filters query state.
 */
export const validateFilters = (filters) => {
  const errors = {};
  
  if (filters.startDate && filters.endDate) {
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);
    if (start > end) {
      errors.dateRange = "Start date cannot be after end date.";
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates parameters for report exports.
 */
export const validateExport = (report, exportType) => {
  const errors = {};
  
  if (!report) {
    errors.report = "No report selected for export.";
  }
  
  const validTypes = ["PDF", "EXCEL", "CSV", "PRINT"];
  if (!exportType || !validTypes.includes(exportType.toUpperCase())) {
    errors.exportType = "Unsupported export file type.";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
