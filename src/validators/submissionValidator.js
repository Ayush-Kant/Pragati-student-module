const { body, validationResult } = require('express-validator');

const validateSubmission = [
    body('challengeId').isInt().withMessage('Challenge ID must be an integer.'),
    body('studentId').isInt().withMessage('Student ID must be an integer.'),
    body('sourceCode').isString().notEmpty().withMessage('Source code is required.'),
    body('language').isString().notEmpty().withMessage('Language is required.')
];

const sanitizeInput = (req, res, next) => {
    req.body.sourceCode = req.body.sourceCode.trim();
    req.body.language = req.body.language.trim();
    next();
};

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateSubmission,
    sanitizeInput,
    validateRequest
};