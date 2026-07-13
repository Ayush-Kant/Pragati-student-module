import * as lessonModel from "../models/lessonModel.js";

export const getLessons = async (moduleId) => {
    return await lessonModel.getLessons(moduleId);
};

export const getLesson = async (lessonId) => {
    return await lessonModel.getLessonById(lessonId);
};

export const updateLessonProgress = async (
    lessonId,
    studentId,
    completed
) => {
    return await lessonModel.updateLessonProgress(
        lessonId,
        studentId,
        completed
    );
};