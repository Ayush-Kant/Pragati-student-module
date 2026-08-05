import * as service from '../services/collegeReportExports.service.js';

const getExports = async (req, res, next) => {
    try {
        const exportsData = await service.listExports(req.query);
        res.status(200).json({
            success: true,
            data: exportsData,
        });
    } catch (error) {
        next(error);
    }
};

const createExport = async (req, res, next) => {
    try {
        const exportRecord = await service.createExport(req.body);
        res.status(201).json({
            success: true,
            data: exportRecord,
        });
    } catch (error) {
        next(error);
    }
};

const getExportById = async (req, res, next) => {
    try {
        const exportRecord = await service.getExportById(req.params.id);
        if (!exportRecord) {
            return res.status(404).json({
                success: false,
                message: 'Export record not found',
                data: null,
            });
        }
        res.status(200).json({
            success: true,
            data: exportRecord,
        });
    } catch (error) {
        next(error);
    }
};

const streamExport = async (req, res, next, format) => {
    try {
        const result = await service.exportReport(req.params.id, format);
        res.setHeader('Content-Type', result.contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
        return res.send(result.buffer);
    } catch (error) {
        next(error);
    }
};

const exportReportPdf = (req, res, next) => streamExport(req, res, next, 'pdf');
const exportReportExcel = (req, res, next) => streamExport(req, res, next, 'excel');
const exportReportCsv = (req, res, next) => streamExport(req, res, next, 'csv');

export {
    getExports,
    createExport,
    getExportById,
    exportReportPdf,
    exportReportExcel,
    exportReportCsv,
};
export default {
    getExports,
    createExport,
    getExportById,
    exportReportPdf,
    exportReportExcel,
    exportReportCsv,
};
