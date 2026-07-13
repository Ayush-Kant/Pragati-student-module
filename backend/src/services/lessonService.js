import * as lessonModel from "../models/lessonModel.js";

export const getLessons = async (moduleId, studentId) => {
    return await lessonModel.getLessons(moduleId, studentId);
};

export const getLesson = async (lessonId, studentId) => {
    return await lessonModel.getLessonById(lessonId, studentId);
};

export const updateLessonProgress = async (lessonId, studentId, completed) => {
    if (!studentId) {
        throw new Error("Student authentication required");
    }

    return await lessonModel.updateLessonProgress(lessonId, studentId, Boolean(completed));
};