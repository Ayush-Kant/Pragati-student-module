// ─────────────────────────────────────────────────────────────────────────────
//  validateRequest.js
//  Middleware factory: wraps a validator function or Joi schema into an
//  Express middleware.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * validateRequest
 * ────────────────
 * Returns an Express middleware that validates the incoming request target.
 *
 * @param {function|Object} validatorFn - Either a legacy validator function or a Joi schema.
 * @param {string} [source='body'] - Which request object to validate: body, query, or params.
 * @param {object} [options]
 * @param {boolean} [options.requireName] - Forwarded to legacy validators that accept it.
 * @returns {function} Express middleware
 */
export const validateRequest = (validatorFn, source = 'body', options = {}) => {
    return (req, res, next) => {
        const target = source === 'query' ? req.query : source === 'params' ? req.params : req.body;

        if (typeof validatorFn === 'function') {
            const result = validatorFn(target, options.requireName);

            if (!result.valid) {
                return res.status(422).json({
                    success: false,
                    message: 'Validation failed',
                    error: { details: result.errors },
                });
            }

            const sanitized = result.sanitized ?? target;
            if (source === 'query') {
                req.query = sanitized;
            } else if (source === 'params') {
                req.params = sanitized;
            } else {
                req.body = sanitized;
            }
            return next();
        }

        if (validatorFn && typeof validatorFn.validate === 'function') {
            const { error, value } = validatorFn.validate(target, {
                abortEarly: false,
                convert: true,
            });

            if (error) {
                return res.status(422).json({
                    success: false,
                    message: 'Validation failed',
                    error: { details: error.details.map((detail) => detail.message) },
                });
            }

            if (source === 'query') {
                req.query = value;
            } else if (source === 'params') {
                req.params = value;
            } else {
                req.body = value;
            }
            return next();
        }

        return next();
    };
};
