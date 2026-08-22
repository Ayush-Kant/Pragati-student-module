import * as model from '../models/collegeReportExports.model.js';
import { getReportById, createHistoryEntry } from '../models/collegeReports.model.js';
import { generateReportPdf } from '../utils/pdfGenerator.js';
import { convertToCSV } from '../utils/exportHelper.js';

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

/**
 * Generates file buffer (PDF/CSV/Excel), logs to report_exports and report_history.
 */
const exportReport = async (reportId, format = 'pdf') => {
    const report = await getReportById(reportId);
    if (!report) {
        throw new Error(`Report with ID ${reportId} not found`);
    }

    const normFormat = (format || report.format || 'pdf').toLowerCase();
    const safeTitle = (report.title || 'report').replace(/\s+/g, '_').toLowerCase();

    try {
        let buffer;
        let contentType;
        let ext = normFormat;

        if (normFormat === 'pdf') {
            buffer = await generateReportPdf(report);
            contentType = 'application/pdf';
        } else if (normFormat === 'csv' || normFormat === 'excel') {
            ext = normFormat === 'excel' ? 'csv' : normFormat; // standard tabular export
            contentType = 'text/csv';

            const content = typeof report.content === 'string' ? JSON.parse(report.content || '{}') : (report.content || {});
            const records = Array.isArray(content.records) ? content.records : (Array.isArray(content) ? content : []);
            
            if (records.length > 0) {
                const headers = Object.keys(records[0]);
                const csvStr = convertToCSV(records, headers, headers.map(h => h.replace(/([A-Z])/g, ' $1').toUpperCase()));
                buffer = Buffer.from(csvStr, 'utf8');
            } else {
                buffer = Buffer.from(`"Title","Type","Created At"\n"${report.title}","${report.type}","${report.createdAt}"`, 'utf8');
            }
        } else {
            ext = 'json';
            contentType = 'application/json';
            const jsonStr = typeof report.content === 'string' ? report.content : JSON.stringify(report.content || {}, null, 2);
            buffer = Buffer.from(jsonStr, 'utf8');
        }

        // Log successful export
        await model.createExport({
            reportId: Number(reportId),
            format: normFormat,
            status: 'completed',
        });

        // Log history entry
        await createHistoryEntry({
            reportId: Number(reportId),
            action: 'exported',
        });

        return {
            buffer,
            filename: `${safeTitle}_${Date.now()}.${ext}`,
            contentType,
        };
    } catch (error) {
        // Log failed export
        await model.createExport({
            reportId: Number(reportId),
            format: normFormat,
            status: 'failed',
            errorMessage: error.message,
        });
        throw error;
    }
};

export {
    listExports,
    createExport,
    getExportById,
    exportReport,
};
export default {
    listExports,
    createExport,
    getExportById,
    exportReport,
};
