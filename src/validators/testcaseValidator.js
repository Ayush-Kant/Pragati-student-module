const { body, validationResult } = require('express-validator');

const validateTestCase = [
    body('challengeId').isInt().withMessage('Challenge ID must be an integer'),
    body('input').isString().withMessage('Input must be a string'),
    body('expectedOutput').isString().withMessage('Expected output must be a string'),
    body('visibility').isIn(['Public', 'Hidden']).withMessage('Visibility must be either Public or Hidden'),
];

const sanitizeInput = (req, res, next) => {
    req.body.input = req.body.input.trim();
    req.body.expectedOutput = req.body.expectedOutput.trim();
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
    validateTestCase,
    sanitizeInput,
    validateRequest,
};