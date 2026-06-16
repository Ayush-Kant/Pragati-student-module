export const validateDashboard = (req, res, next) => {
    next();
};

export const validateDriveId = (req, res, next) => {
    const { driveId } = req.params;

    if (!driveId) {
        return res.status(400).json({
            success: false,
            message: "Drive ID is required",
        });
    }

    next();
};

export const validateStudent = (req, res, next) => {
    const { studentId } = req.body;

    if (!studentId) {
        return res.status(400).json({
            success: false,
            message: "Student ID is required",
        });
    }

    next();
};

export const validateLeaderboard = (req, res, next) => {
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