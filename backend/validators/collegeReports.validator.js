import { REPORT_FORMATS, REPORT_TYPES } from '../constants/collegeReportsGeneration.constants.js';

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

const validateRequestBody = (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            message: 'Request body cannot be empty',
        });
    }

    next();
};

const isPositiveInteger = (value) => {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0;
};

const validateListReports = (req, res, next) => {
    const { page, limit } = req.query;

    if (page && !isPositiveInteger(page)) {
        return res.status(400).json({ message: 'Page must be a positive number' });
    }

    if (limit && !isPositiveInteger(limit)) {
        return res.status(400).json({ message: 'Limit must be a positive number' });
    }

    next();
};

const validateGenerateReport = (req, res, next) => {
    const { title, type, format, content } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ message: 'Report title is required' });
    }

    if (!type || typeof type !== 'string') {
        return res.status(400).json({ message: 'Report type is required' });
    }

    const normalizedType = type.toLowerCase();
    if (!Object.values(REPORT_TYPES).includes(normalizedType)) {
        return res.status(400).json({ message: 'Report type is invalid' });
    }

    if (format && typeof format !== 'string') {
        return res.status(400).json({ message: 'Report format must be a string' });
    }

    if (format) {
        const normalizedFormat = format.toLowerCase();
        if (!Object.values(REPORT_FORMATS).includes(normalizedFormat)) {
            return res.status(400).json({ message: 'Report format is invalid' });
        }
        req.body.format = normalizedFormat;
    }

    if (content !== undefined && (typeof content !== 'object' || Array.isArray(content))) {
        return res.status(400).json({ message: 'Report content must be an object' });
    }

    req.body.type = normalizedType;
    next();
};

const validateReportId = (req, res, next) => {
    const { id } = req.params;

    if (!id || !isPositiveInteger(id)) {
        return res.status(400).json({ message: 'Invalid report ID' });
    }

    next();
};

export {
    sanitizeInput,
    validateRequestBody,
    validateListReports,
    validateGenerateReport,
    validateReportId,
};
