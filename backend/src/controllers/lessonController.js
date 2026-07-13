import * as lessonService from "../services/lessonService.js";

const getStudentId = (req) => req.user?.userId ?? req.user?.id ?? null;

export const getLessons = async (req, res, next) => {
    try {
        const lessons = await lessonService.getLessons(req.params.id, getStudentId(req));

        return res.status(200).json({ success: true, data: lessons });
    } catch (error) {
        next(error);
    }
};

export const getLessonById = async (req, res, next) => {
    try {
        const lesson = await lessonService.getLesson(req.params.id, getStudentId(req));

        if (!lesson) {
            return res.status(404).json({ success: false, message: "Lesson not found" });
        }

        return res.status(200).json({ success: true, data: lesson });
    } catch (error) {
        next(error);
    }
};

export const updateLessonProgress = async (req, res, next) => {
    try {
        const progress = await lessonService.updateLessonProgress(
            req.params.id,
            getStudentId(req),
            req.body.completed,
        );

        return res.status(200).json({ success: true, data: progress });
    } catch (error) {
        next(error);
    }
};