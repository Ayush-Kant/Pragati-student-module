export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode
        || err.status
        || (err.code === '23505' ? 409 : null)
        || (err.code === '23503' ? 404 : null)
        || 500;

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

    if (err.errors && Array.isArray(err.errors)) {
        payload.error.details = err.errors;
    }

    if (process.env.NODE_ENV === 'development') {
        payload.error.stack = err.stack;
    }

    res.status(statusCode).json(payload);
};

export default errorHandler;
