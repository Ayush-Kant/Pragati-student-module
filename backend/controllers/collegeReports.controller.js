import * as service from '../services/collegeReports.service.js';

const getReports = async (req, res, next) => {
    try {
        const reports = await service.listReports(req.query);

        res.status(200).json({
            success: true,
            data: reports,
        });
    } catch (error) {
        next(error);
    }
};

const generateReport = async (req, res, next) => {
    try {
        const userId = req.user?.userId || req.user?.id || null;
        const report = await service.generateReport(req.body, userId);

        res.status(201).json({
            success: true,
            data: report,
        });
    } catch (error) {
        next(error);
    }
};

const getReportById = async (req, res, next) => {
    try {
        const report = await service.getReportById(req.params.id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found',
            });
        }

        res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        next(error);
    }
};

const deleteReport = async (req, res, next) => {
    try {
        const deleted = await service.deleteReport(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Report not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Report deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

const previewReport = async (req, res, next) => {
    try {
        const preview = await service.previewReport(req.params.id);

        if (!preview) {
            return res.status(404).json({
                success: false,
                message: 'Report not found',
            });
        }

        res.status(200).json({
            success: true,
            data: preview,
        });
    } catch (error) {
        next(error);
    }
};

const downloadReport = async (req, res, next) => {
    try {
        const download = await service.downloadReport(req.params.id);

        if (!download) {
            return res.status(404).json({
                success: false,
                message: 'Report not found',
            });
        }

        res.status(200).json({
            success: true,
            data: download,
        });
    } catch (error) {
        next(error);
    }
};

export {
    getReports,
    generateReport,
    getReportById,
    deleteReport,
    previewReport,
    downloadReport,
};
