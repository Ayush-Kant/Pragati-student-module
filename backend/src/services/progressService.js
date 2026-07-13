import * as progressModel from "../models/progressModel.js";

export const getCourseProgress = async (studentId) => {
    return await progressModel.getCourseProgress(studentId);
};

export const updateCourseProgress = async (studentId, courseId, progress) => {
    if (!studentId) {
        throw new Error("Student authentication required");
    }

    return await progressModel.updateCourseProgress(studentId, courseId, Number(progress));
};

export const getLearningStatistics = async (studentId) => {
    return await progressModel.getLearningStatistics(studentId);
};