/**
 * Analytics Data Validation Utility Module
 * Pure synchronous functions to protect structural system constraints.
 */

/**
 * Validates a start and end date range boundary chronology.
 * @param {string} start - ISO or YYYY-MM-DD format string representation of beginning parameter boundary
 * @param {string} end - ISO or YYYY-MM-DD format string representation of terminal parameter boundary
 * @returns {Object} Validation response matching shape: { isValid: boolean, message: string }
 */
export const validateDateRange = (start, end) => {
  if (!start && !end) {
    return { isValid: true, message: "" };
  }

  if ((start && !end) || (!start && end)) {
    return { isValid: false, message: "Both start and end dates must be provided together." };
  }

  const startDateParsed = new Date(start);
  const endDateParsed = new Date(end);

  if (isNaN(startDateParsed.getTime()) || isNaN(endDateParsed.getTime())) {
    return { isValid: false, message: "One or more parameter arguments are invalid timestamp patterns." };
  }

  if (startDateParsed > endDateParsed) {
    return { isValid: false, message: "Chronological anomaly detected: Start parameter cannot surpass endpoint matrix date." };
  }

  return { isValid: true, message: "" };
};

/**
 * Validates runtime structure filter payload boundaries.
 * @param {Object} filters - Active operational dashboard filter state configuration parameters
 * @returns {Object} Validation response matching shape: { isValid: boolean, message: string }
 */
export const validateFilters = (filters) => {
  if (!filters || typeof filters !== 'object') {
    return { isValid: false, message: "Operational filter container structure is corrupted or missing." };
  }

  const authorizedBatches = ['2024', '2025', '2026', '2027'];
  if (filters.batch && !authorizedBatches.includes(String(filters.batch))) {
    return { isValid: false, message: `The requested batch parameter matrix target '${filters.batch}' falls outside scope boundaries.` };
  }

  if (filters.dateRange) {
    const checkDateChronology = validateDateRange(filters.dateRange.start, filters.dateRange.end);
    if (!checkDateChronology.isValid) {
      return checkDateChronology;
    }
  }

  return { isValid: true, message: "" };
};

/**
 * Assesses integrity properties for document layout compile pipeline inputs.
 * @param {string} format - File target extension schema descriptor ('PDF' | 'EXCEL')
 * @param {Array|Object} targetData - Content collection bundle target passing into the compiler engine
 * @returns {Object} Validation response matching shape: { isValid: boolean, message: string }
 */
export const validateExportRequest = (format, targetData) => {
  const normalizedFormat = String(format).toUpperCase();
  const legitimateFormats = ['PDF', 'EXCEL', 'PRINT', 'DOWNLOAD'];

  if (!legitimateFormats.includes(normalizedFormat)) {
    return { isValid: false, message: `The requested compilation structure token '${format}' is unrecognized.` };
  }

  if (!targetData) {
    return { isValid: false, message: "The layout stream context is empty; cannot process document synthesis payload." };
  }

  // FIXED: Safely catches empty arrays AND empty objects ({}) 
  const isEmptyArray = Array.isArray(targetData) && targetData.length === 0;
  const isEmptyObject = !Array.isArray(targetData) && typeof targetData === 'object' && Object.keys(targetData).length === 0;

  if (isEmptyArray || isEmptyObject) {
    return { isValid: false, message: "Cannot translate blank matrix registry sets into document archives." };
  }

  return { isValid: true, message: "" };
};