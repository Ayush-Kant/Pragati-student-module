import * as lessonService from "../services/lessonService.js";

export const getLessons = async (req, res, next) => {
    try {
        const lessons = await lessonService.getLessons(req.params.id);

        return res.status(200).json({
            success: true,
            data: lessons,
        });
    } catch (error) {
        next(error);
    }
};

export const getLessonById = async (req, res, next) => {
    try {
        const lesson = await lessonService.getLesson(req.params.id);

        if (!lesson) {
            return res.status(404).json({
                success: false,
                message: "Lesson not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: lesson,
        });
    } catch (error) {
        next(error);
    }
};

export const updateLessonProgress = async (req, res, next) => {
    try {
        const { studentId, completed } = req.body;

        const progress = await lessonService.updateLessonProgress(
            req.params.id,
            studentId,
            completed
        );

        return res.status(200).json({
            success: true,
            data: progress,
        });
    } catch (error) {
        next(error);
    }
};