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

const validateListExports = (req, res, next) => {
    const { page, limit } = req.query;

    if (page && !isPositiveInteger(page)) {
        return res.status(400).json({ success: false, message: 'Page must be a positive number', data: null });
    }

    if (limit && !isPositiveInteger(limit)) {
        return res.status(400).json({ success: false, message: 'Limit must be a positive number', data: null });
    }

    next();
};

const validateCreateExport = (req, res, next) => {
    const { reportId, format } = req.body;

    if (!reportId || !isPositiveInteger(reportId)) {
        return res.status(400).json({ success: false, message: 'Valid report ID is required', data: null });
    }

    if (!format || !['pdf', 'excel', 'csv'].includes(format.toLowerCase())) {
        return res.status(400).json({ success: false, message: 'Export format must be pdf, excel, or csv', data: null });
    }

    next();
};

const validateExportId = (req, res, next) => {
    const { id } = req.params;

    if (!id || !isPositiveInteger(id)) {
        return res.status(400).json({ success: false, message: 'Invalid export ID', data: null });
    }

    next();
};

export {
    sanitizeInput,
    validateListExports,
    validateCreateExport,
    validateExportId,
};
export default {
    sanitizeInput,
    validateListExports,
    validateCreateExport,
    validateExportId,
};
