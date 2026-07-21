// ─────────────────────────────────────────────────────────────────────────────
//  errorHandler.js
//  Global Express error-handling middleware.
//
//  Must be registered LAST in the middleware chain (after all routes):
//    app.use(errorHandler);
//
//  Catches any error passed via next(err) and formats a consistent
//  JSON response. In development, includes the stack trace.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * errorHandler
 * ─────────────
 * Express 4-argument error handler.
 * Reads err.statusCode if set by service/model layers, defaults to 500.
 *
 * @param {Error}  err
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
const errorHandler = (err, req, res, next) => {
    // Determine appropriate HTTP status code
    const statusCode = err.statusCode
        || (err.code === '23505' ? 409 : null)  // PostgreSQL unique violation
        || (err.code === '23503' ? 404 : null)  // PostgreSQL foreign key violation
        || 500;

    // Log server errors
    if (statusCode >= 500) {
        console.error(`[ErrorHandler] ${req.method} ${req.path}`, err);
    }

    const payload = {
        success: false,
        message: err.message || 'An unexpected error occurred',
        error: {
            code: err.code,
        },
    };

    // Include validation errors array if present
    if (err.errors && Array.isArray(err.errors)) {
        payload.error.details = err.errors;
    }

    // Include stack trace in development only
    if (process.env.NODE_ENV === 'development') {
        payload.error.stack = err.stack;
    }

    res.status(statusCode).json(payload);
};

export default errorHandler;
