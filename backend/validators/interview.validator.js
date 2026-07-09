// interview.validator.js

/**
 * Validate Interview ID param
 */
const validateInterviewId = (req, res, next) => {
    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({
            message: "Valid interview id is required",
        });
    }

    next();
};

/**
 * Validate Create Interview Request
 */
const validateCreateInterview = (req, res, next) => {
    const { applicationId, scheduledAt, interviewType, interviewerId } = req.body;

    const allowedTypes = [
        "technical",
        "hr",
        "culture_fit",
        "final",
    ];

    if (!applicationId || isNaN(applicationId)) {
        return res.status(400).json({
            message: "Valid applicationId is required",
        });
    }

    if (!scheduledAt) {
        return res.status(400).json({
            message: "scheduledAt is required",
        });
    }

    if (
        !interviewType ||
        !allowedTypes.includes(interviewType.toLowerCase())
    ) {
        return res.status(400).json({
            message:
                "interviewType must be one of: technical, hr, culture_fit, final",
        });
    }

    if (interviewerId && isNaN(interviewerId)) {
        return res.status(400).json({
            message: "interviewerId must be a valid number",
        });
    }

    req.body.interviewType = interviewType.toLowerCase();

    next();
};

/**
 * Validate Feedback Request
 */
const validateFeedback = (req, res, next) => {
    const { feedback } = req.body;

    if (!feedback || feedback.trim() === "") {
        return res.status(400).json({
            message: "feedback is required",
        });
    }

    next();
};

/**
 * Validate Result Update Request
 */
const validateResult = (req, res, next) => {
    const { result } = req.body;

    const allowedResults = [
        "pass",
        "fail",
        "pending",
    ];

    if (
        !result ||
        !allowedResults.includes(result.toLowerCase())
    ) {
        return res.status(400).json({
            message:
                "result must be one of: PASS, FAIL, PENDING",
        });
    }

    req.body.result = result.toUpperCase();

    next();
};

export {
    validateInterviewId,
    validateCreateInterview,
    validateFeedback,
    validateResult,
};