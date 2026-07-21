import * as progressService from "../services/progressService.js";

const getStudentId = (req) => req.user?.userId ?? req.user?.id ?? null;

export const getCourseProgress = async (req, res, next) => {
    try {
        const studentId = getStudentId(req);
        if (!studentId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
                error: {},
            });
        }

        const progress = await progressService.getCourseProgress(studentId);

        return res.status(200).json({
            success: true,
            message: "Course progress retrieved successfully",
            data: progress,
        });
    } catch (error) {
        next(error);
    }
};

export const updateCourseProgress = async (req, res, next) => {
    try {
        const studentId = getStudentId(req);
        if (!studentId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
                error: {},
            });
        }

        const result = await progressService.updateCourseProgress(
            studentId,
            req.body.courseId,
            req.body.progress,
        );

        if (result === null) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
                error: { courseId: req.body.courseId },
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course progress updated successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const getLearningStatistics = async (req, res, next) => {
    try {
        const studentId = getStudentId(req);
        if (!studentId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
                error: {},
            });
        }

        const stats = await progressService.getLearningStatistics(studentId);

        return res.status(200).json({
            success: true,
            message: "Learning statistics retrieved successfully",
            data: stats,
        });
    } catch (error) {
        next(error);
    }
};