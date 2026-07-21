import {
    EXPORT_STATUSES,
    REPORT_FORMATS,
} from '../constants/collegeReportsGeneration.constants.js';

const normalizeExportFormat = (value) => {
    const normalized = typeof value === 'string' ? value.toLowerCase() : '';
    return Object.values(REPORT_FORMATS).includes(normalized) ? normalized : REPORT_FORMATS.PDF;
};

const normalizeExportStatus = (value) => {
    const normalized = typeof value === 'string' ? value.toLowerCase() : '';
    return Object.values(EXPORT_STATUSES).includes(normalized) ? normalized : EXPORT_STATUSES.COMPLETED;
};

const buildExportPayload = ({ reportId, format, status = EXPORT_STATUSES.COMPLETED } = {}) => ({
    reportId: reportId || null,
    format: normalizeExportFormat(format),
    status: normalizeExportStatus(status),
});

const buildExportResponse = (exportRecord = {}) => ({
    id: exportRecord.id || null,
    reportId: exportRecord.reportId || exportRecord.report_id || null,
    format: normalizeExportFormat(exportRecord.format),
    status: normalizeExportStatus(exportRecord.status),
    createdAt: exportRecord.createdAt || exportRecord.created_at || null,
});

export {
    buildExportPayload,
    buildExportResponse,
};
