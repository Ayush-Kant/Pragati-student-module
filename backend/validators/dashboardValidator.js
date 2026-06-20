export const validateDashboard = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized access",
        });
    }

    next();
};

export const validateDriveId = (req, res, next) => {
    const { driveId } = req.params;

    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!driveId) {
        return res.status(400).json({
            success: false,
            message: "Drive ID is required",
        });
    }

    if (!uuidRegex.test(driveId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid Drive ID format",
        });
    }

    next();
};

export const validateStudent = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Student authentication required",
        });
    }

    next();
};

export const validateLeaderboard = (req, res, next) => {
    const { driveId } = req.params;

    if (!driveId) {
        return res.status(400).json({
            success: false,
            message: "Drive ID is required",
        });
    }

    next();
};

export const validateRequestBody = (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            success: false,
            message: "Request body cannot be empty",
        });
    }

    next();
};

export const sanitizeInput = (req, res, next) => {
    for (const key in req.body) {
        if (typeof req.body[key] === "string") {
            req.body[key] = req.body[key].trim();
        }
    }

    next();
};