import {
    REPORT_FORMATS,
    REPORT_STATUSES,
    REPORT_TYPES,
} from '../constants/collegeReportsGeneration.constants.js';

const normalizeType = (value) => {
    const normalized = typeof value === 'string' ? value.toLowerCase() : '';
    return Object.values(REPORT_TYPES).includes(normalized) ? normalized : REPORT_TYPES.DASHBOARD;
};

const normalizeFormat = (value) => {
    const normalized = typeof value === 'string' ? value.toLowerCase() : '';
    return Object.values(REPORT_FORMATS).includes(normalized) ? normalized : REPORT_FORMATS.JSON;
};

const buildReportPayload = ({
    title,
    type,
    format,
    content,
    createdBy,
    status = REPORT_STATUSES.COMPLETED,
} = {}) => ({
    title: title || 'Generated Report',
    type: normalizeType(type),
    format: normalizeFormat(format),
    content: content && typeof content === 'object' && !Array.isArray(content) ? content : {},
    createdBy,
    status,
});

const buildReportSummary = (report = {}) => ({
    id: report.id || null,
    title: report.title || 'Generated Report',
    type: normalizeType(report.type),
    status: report.status || REPORT_STATUSES.COMPLETED,
    format: normalizeFormat(report.format),
    generatedAt: report.createdAt || report.created_at || null,
});

export {
    buildReportPayload,
    buildReportSummary,
};
