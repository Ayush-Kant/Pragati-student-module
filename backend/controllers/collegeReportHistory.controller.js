import * as service from '../services/collegeReportHistory.service.js';

const getHistory = async (req, res, next) => {
    try {
        const history = await service.listHistory(req.query);

        res.status(200).json({
            success: true,
            data: history,
        });
    } catch (error) {
        next(error);
    }
};

const getHistoryById = async (req, res, next) => {
    try {
        const historyItem = await service.getHistoryById(req.params.id);

        if (!historyItem) {
            return res.status(404).json({
                success: false,
                message: 'History record not found',
            });
        }

        res.status(200).json({
            success: true,
            data: historyItem,
        });
    } catch (error) {
        next(error);
    }
};

const deleteHistoryById = async (req, res, next) => {
    try {
        const deleted = await service.deleteHistoryById(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'History record not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'History record deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

export {
    getHistory,
    getHistoryById,
    deleteHistoryById,
};
