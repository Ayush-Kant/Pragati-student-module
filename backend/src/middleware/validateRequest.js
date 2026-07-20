// ─────────────────────────────────────────────────────────────────────────────
//  validateRequest.js
//  Middleware factory: wraps a validator function into an Express middleware.
//
//  Supports two calling conventions:
//
//  1. Validator-function style (student-team):
//       validateRequest(validatorFn, options?)
//       where validatorFn(body) => { valid, errors, sanitized }
//
//  2. Joi-schema style (Projects Backend):
//       validateRequest(joiSchema, 'body'|'params'|'query')
//       where joiSchema.validate(data) => { error, value }
// ─────────────────────────────────────────────────────────────────────────────

/**
 * validateRequest
 * ────────────────
 * Unified middleware factory that works with both validator-function style and Joi schema style.
 *
 * @param {function|object} validatorOrSchema - A validator fn or a Joi schema
 * @param {string|object}   [propertyOrOptions] - 'body'|'params'|'query' (Joi), or options object (validator fn)
 * @returns {function} Express middleware
 */
export const validateRequest = (validatorOrSchema, propertyOrOptions = 'body') => {
    return (req, res, next) => {
        if (!validatorOrSchema) return next();

        // Joi schema style: has a .validate() method
        if (typeof validatorOrSchema.validate === 'function') {
            const property = typeof propertyOrOptions === 'string' ? propertyOrOptions : 'body';
            const { error, value } = validatorOrSchema.validate(req[property]);
            if (error) {
                const detailedErrors = error.details.reduce((acc, curr) => {
                    acc[curr.path[0]] = curr.message;
                    return acc;
                }, {});
                return res.status(400).json({
                    success: false,
                    message: error.details[0].message || 'Validation failed',
                    errors: detailedErrors
                });
            }
            if (property === 'query') req.validatedQuery = value;
            else if (property === 'body') req.validatedBody = value;
            else if (property === 'params') req.validatedParams = value;
            return next();
        }

        // Validator-function style: validatorOrSchema(body, requireName?) => { valid, errors, sanitized }
        const options = typeof propertyOrOptions === 'object' ? propertyOrOptions : {};
        const result = validatorOrSchema(req.body, options.requireName);

        if (!result.valid) {
            return res.status(422).json({
                success: false,
                message: 'Validation failed',
                errors: result.errors,
            });
        }

        // Replace body with the sanitized version
        req.body = result.sanitized;
        next();
    };
};

export default validateRequest;
