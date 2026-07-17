import * as model from '../models/collegeReports.model.js';

const listReports = async (filters = {}) => {
    const page = parseInt(filters.page, 10) || 1;
    const limit = parseInt(filters.limit, 10) || 20;
    const offset = (page - 1) * limit;

    const [reports, total] = await Promise.all([
        model.getReports({
            ...filters,
            page,
            limit,
            offset,
        }),
        model.countReports({
            type: filters.type,
            status: filters.status,
        }),
    ]);

    return {
        reports,
        page,
        limit,
        total,
    };
};

const generateReport = async (payload = {}, userId = null) => {
    const reportPayload = {
        ...payload,
        createdBy: userId,
        status: 'completed',
    };

    const report = await model.createReport(reportPayload);
    await model.createHistoryEntry({
        reportId: report.id,
        action: 'generated',
    });

    return report;
};

const getReportById = async (id) => {
    return model.getReportById(id);
};

const deleteReport = async (id) => {
    return model.deleteReport(id);
};

const previewReport = async (id) => {
    const report = await model.getReportById(id);

    if (!report) {
        return null;
    }

    return {
        ...report,
        preview: true,
        content: report.content || {},
    };
};

const downloadReport = async (id) => {
    const report = await model.getReportById(id);

    if (!report) {
        return null;
    }

    return {
        ...report,
        downloadUrl: `/api/reports/${id}/download`,
        format: report.format || 'json',
    };
};

export {
    listReports,
    generateReport,
    getReportById,
    deleteReport,
    previewReport,
    downloadReport,
};
