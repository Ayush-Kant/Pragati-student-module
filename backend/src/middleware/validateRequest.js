// ─────────────────────────────────────────────────────────────────────────────
//  validateRequest.js
//  Middleware factory: wraps a validator function into an Express middleware.
//
//  Usage:
//    import { validateRequest } from '../middleware/validateRequest.js';
//    import { validateSkill }   from '../validators/skillsValidator.js';
//
//    router.post('/skills', validateRequest(validateSkill), skillsController.addSkill);
//
//  The validator function receives req.body and must return:
//    { valid: boolean, errors: string[], sanitized: object }
//
//  On success:
//    • Replaces req.body with sanitized data.
//    • Calls next().
//  On failure:
//    • Returns HTTP 422 Unprocessable Entity with the errors array.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * validateRequest
 * ────────────────
 * Returns an Express middleware that applies the given validator to req.body.
 *
 * @param {function} validatorFn - A function (body) => { valid, errors, sanitized }
 * @param {object}   [options]
 * @param {boolean}  [options.requireName] - Forwarded to validators that accept it (e.g., skills PUT).
 * @returns {function} Express middleware
 */
export const validateRequest = (validatorFn, source = 'body', options = {}) => {
    return (req, res, next) => {
        const target = source === 'query' ? req.query : source === 'params' ? req.params : req.body;

        const assignValidated = (val) => {
            if (source === 'query') {
                req.query = val;
                req.validatedQuery = val;
            } else if (source === 'params') {
                req.params = val;
                req.validatedParams = val;
            } else {
                req.body = val;
                req.validatedBody = val;
            }
        };

        if (typeof validatorFn === 'function') {
            const result = validatorFn(target, options.requireName);

            if (!result || result.valid === false) {
                return res.status(422).json({
                    success: false,
                    message: 'Validation failed',
                    error: { details: result?.errors ?? ['Invalid request'] },
                });
            }

            const sanitized = result.sanitized ?? target;
            assignValidated(sanitized);
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
                    error: { details: error.details.map((d) => d.message) },
                });
            }

            assignValidated(value);
            return next();
        }

        return next();
    };
};

export default validateRequest;
