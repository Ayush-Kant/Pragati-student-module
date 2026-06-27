// errorHandler.js

/**
 * Shared error handling helper for controller catch blocks.
 * Maps specific error names or message keywords to HTTP status codes
 * and sends a consistent JSON error response.
 *
 * @param {Object} res - Express response object
 * @param {Error|Object} err - Error object caught in the try-catch block
 * @returns {Object} Express response object
 */
export const handleControllerError = (res, err) => {
  let status = err.status || 500;
  if (!err.status) {
    const message = err.message?.toLowerCase() || "";
    const name = err.name || "";

    if (
      name === "ValidationError" ||
      message.includes("validation") ||
      message.includes("invalid")
    ) {
      status = 400;
    } else if (
      name === "UnauthorizedError" ||
      message.includes("unauthorized") ||
      message.includes("auth")
    ) {
      status = 401;
    } else if (
      name === "ForbiddenError" ||
      message.includes("forbidden") ||
      message.includes("denied")
    ) {
      status = 403;
    } else if (name === "NotFoundError" || message.includes("not found")) {
      status = 404;
    }
  }

  return res.status(status).json({
    success: false,
    message: err.message,
  });
};
