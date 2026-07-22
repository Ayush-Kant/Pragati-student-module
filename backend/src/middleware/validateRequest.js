// ─────────────────────────────────────────────────────────────────────────────
//  validateRequest.js
//  Unified middleware that supports Joi schemas, legacy validator functions,
//  and body/params/query validation in one place.
// ─────────────────────────────────────────────────────────────────────────────

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

        if (typeof validatorFn === 'function') {
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

            assignValidated(req, source, value);
            return next();
        }

        return next();
    };
};

export default validateRequest;
