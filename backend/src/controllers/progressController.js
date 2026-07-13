import * as progressService from "../services/progressService.js";

const getStudentId = (req) => req.user?.userId ?? req.user?.id ?? null;

export const getCourseProgress = async (req, res, next) => {
    try {
        const progress = await progressService.getCourseProgress(getStudentId(req));

        return res.status(200).json({ success: true, data: progress });
    } catch (error) {
        next(error);
    }
};

export const updateCourseProgress = async (req, res, next) => {
    try {
        const result = await progressService.updateCourseProgress(
            getStudentId(req),
            req.body.courseId,
            req.body.progress,
        );

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const getLearningStatistics = async (req, res, next) => {
    try {
        const stats = await progressService.getLearningStatistics(getStudentId(req));

        return res.status(200).json({ success: true, data: stats });
    } catch (error) {
        next(error);
    }
};