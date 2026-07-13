import * as progressService from "../services/progressService.js";

export const getCourseProgress = async (req, res, next) => {
    try {
        const { studentId } = req.query;

        const progress = await progressService.getCourseProgress(studentId);

        return res.status(200).json({
            success: true,
            data: progress,
        });
    } catch (error) {
        next(error);
    }
};

export const updateCourseProgress = async (req, res, next) => {
    try {
        const { studentId, courseId, progress } = req.body;

        const result = await progressService.updateCourseProgress(
            studentId,
            courseId,
            progress
        );

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const getLearningStatistics = async (req, res, next) => {
    try {
        const { studentId } = req.query;

        const stats = await progressService.getLearningStatistics(studentId);

        return res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        next(error);
    }
};