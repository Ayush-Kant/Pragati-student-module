const sanitizeInput = (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
        Object.keys(req.body).forEach((key) => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim();
            }
        });
    }

    if (req.query && typeof req.query === 'object') {
        Object.keys(req.query).forEach((key) => {
            if (typeof req.query[key] === 'string') {
                req.query[key] = req.query[key].trim();
            }
        });
    }

    next();
};

const isPositiveInteger = (value) => {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0;
};

const validateListHistory = (req, res, next) => {
    const { page, limit } = req.query;

    if (page && !isPositiveInteger(page)) {
        return res.status(400).json({ message: 'Page must be a positive number' });
    }

    if (limit && !isPositiveInteger(limit)) {
        return res.status(400).json({ message: 'Limit must be a positive number' });
    }

    next();
};

const validateHistoryId = (req, res, next) => {
    const { id } = req.params;

    if (!id || !isPositiveInteger(id)) {
        return res.status(400).json({ message: 'Invalid history ID' });
    }

    next();
};

export {
    sanitizeInput,
    validateListHistory,
    validateHistoryId,
};
