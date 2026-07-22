// projectHelpers.js

/**
 * Formats a successful response payload.
 * @param {string} message 
 * @param {object} data 
 * @returns {object}
 */
export const formatSuccess = (message, data = {}) => {
  return {
    success: true,
    message: message || "Request completed successfully",
    data
  };
};

/**
 * Formats an error response payload.
 * @param {string} message 
 * @param {object} error 
 * @returns {object}
 */
export const formatError = (message, error = {}) => {
  return {
    success: false,
    message: message || "An error occurred",
    error
  };
};
