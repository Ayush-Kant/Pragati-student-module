import * as model from '../models/collegeReportExports.model.js';

const listExports = async (filters = {}) => {
    const page = parseInt(filters.page, 10) || 1;
    const limit = parseInt(filters.limit, 10) || 20;
    const offset = (page - 1) * limit;

    const [exportsData, total] = await Promise.all([
        model.getExports({
            ...filters,
            page,
            limit,
            offset,
        }),
        model.countExports({
            status: filters.status,
        }),
    ]);

    return {
        exports: exportsData,
        page,
        limit,
        total,
    };
};

const createExport = async (payload = {}) => {
    return model.createExport(payload);
};

const getExportById = async (id) => {
    return model.getExportById(id);
};

const exportReport = async (reportId, format = 'pdf') => {
    return {
        reportId,
        format,
        status: 'queued',
        message: 'Export generation is not implemented yet',
    };
};

export {
    listExports,
    createExport,
    getExportById,
    exportReport,
};
