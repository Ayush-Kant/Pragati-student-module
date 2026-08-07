// Unified validateRequest middleware supporting:
// - legacy validator functions returning { valid, sanitized, errors }
// - Joi-style schema objects with .validate(target)
// - simple function(payload) -> { value, error } (used by our quiz validators)
const resolveOptions = (sourceOrOptions = 'body', options = {}) => {
    if (typeof sourceOrOptions === 'string') {
        return { source: sourceOrOptions, options };
    }

    return {
        source: sourceOrOptions?.source ?? 'body',
        options: sourceOrOptions ?? {},
    };
};

const selectTarget = (req, source) => {
    if (source === 'query') return req.query;
    if (source === 'params') return req.params;
    return req.body;
};

const assignValidated = (req, source, value) => {
    if (source === 'query') {
        req.query = value;
        req.validatedQuery = value;
        return;
    }

    if (source === 'params') {
        req.params = value;
        req.validatedParams = value;
        return;
    }

    req.body = value;
    req.validatedBody = value;
};

export const validateRequest = (validatorFn, sourceOrOptions = 'body', options = {}) => {
    const { source, options: resolvedOptions } = resolveOptions(sourceOrOptions, options);

    return (req, res, next) => {
        const target = selectTarget(req, source);

        try {
            // If validatorFn is a function expecting a single argument and returning
            // a Joi-like { value, error } pair, use it directly.
            if (typeof validatorFn === 'function') {
                // If the function declares only one parameter, assume it's the simple
                // validator style used across this repo: fn(payload) => { value, error }
                if (validatorFn.length === 1) {
                    const { value, error } = validatorFn(target);
                    if (error) {
                        return res.status(400).json({ success: false, message: error.message });
                    }
                    assignValidated(req, source, value);
                    return next();
                }

                // Otherwise call it as middleware-style validator
                const result = validatorFn(target, resolvedOptions.requireName);
                if (!result || result.valid === false) {
                    return res.status(422).json({
                        success: false,
                        message: 'Validation failed',
                        error: { details: result?.errors ?? ['Invalid request'] },
                    });
                }

                const sanitized = result.sanitized ?? target;
                assignValidated(req, source, sanitized);
                return next();
            }

            // Support objects with a .validate() method (e.g., Joi schemas)
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

                assignValidated(req, source, value);
                return next();
            }

            return next();
        } catch (err) {
            return next(err);
        }
    };
};

export default validateRequest;
