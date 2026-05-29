// company.validator.js

const validateRejectBody = (req, res, next) => {
    if (!req.body || !req.body.reason || req.body.reason.trim().length < 5)
        return res.status(400).json({
            error:   true,
            message: 'A rejection reason (min 5 characters) is required.',
            code:    'MISSING_REASON',
        });
    next();
};

const validateSuspendBody = (req, res, next) => {
    if (!req.body || !req.body.reason || req.body.reason.trim().length < 5)
        return res.status(400).json({
            error:   true,
            message: 'A suspension reason (min 5 characters) is required.',
            code:    'MISSING_REASON',
        });
    next();
};

export { validateRejectBody, validateSuspendBody };
