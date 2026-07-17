import * as service from '../services/collegeReportExports.service.js';

const getExports = async (req, res, next) => {
    try {
        const exports = await service.listExports(req.query);

        res.status(200).json({
            success: true,
            data: exports,
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

const exportReportPdf = async (req, res, next) => {
    try {
        const exportRecord = await service.exportReport(req.params.id, 'pdf');

        res.status(200).json({
            success: true,
            data: exportRecord,
        });
    } catch (error) {
        next(error);
    }
};

const exportReportExcel = async (req, res, next) => {
    try {
        const exportRecord = await service.exportReport(req.params.id, 'excel');

        res.status(200).json({
            success: true,
            data: exportRecord,
        });
    } catch (error) {
        next(error);
    }
};

const exportReportCsv = async (req, res, next) => {
    try {
        const exportRecord = await service.exportReport(req.params.id, 'csv');

        res.status(200).json({
            success: true,
            data: exportRecord,
        });
    } catch (error) {
        next(error);
    }
};

export {
    getExports,
    createExport,
    getExportById,
    exportReportPdf,
    exportReportExcel,
    exportReportCsv,
};
