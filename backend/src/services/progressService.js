import * as progressModel from "../models/progressModel.js";

export const getCourseProgress = async (studentId) => {
    return await progressModel.getCourseProgress(studentId);
};

export const updateCourseProgress = async (
    studentId,
    courseId,
    progress
) => {
    return await progressModel.updateCourseProgress(
        studentId,
        courseId,
        progress
    );
};

export const getLearningStatistics = async (studentId) => {
    return await progressModel.getLearningStatistics(studentId);
};