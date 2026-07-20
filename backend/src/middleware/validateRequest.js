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
export const validateRequest = (validatorFn, options = {}) => {
    return (req, res, next) => {
        const result = typeof validatorFn === 'function'
            ? validatorFn(req.body, options.requireName)
            : validatorFn.validate(req.body);

        if (!result || result.error) {
            const message = result?.error?.details?.[0]?.message || 'Validation failed';
            return res.status(400).json({
                success: false,
                message,
            });
        }

        if (result.valid === false) {
            return res.status(422).json({
                success: false,
                message: 'Validation failed',
                errors: result.errors,
            });
        }

        req.body = result.sanitized ?? req.body;
        next();
    };
};
