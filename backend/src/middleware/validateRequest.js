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
        // Some validators (e.g. validateSkill) accept a second argument
        const result = validatorFn(req.body, options.requireName);

        if (!result.valid) {
            return res.status(422).json({
                success: false,
                message: 'Validation failed',
                errors: result.errors,
            });
        }

        // Replace body with the sanitized version so controllers/services
        // always receive clean, normalized data.
        req.body = result.sanitized;
        next();
    };
};
