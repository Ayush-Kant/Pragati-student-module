import * as trainingModel from "../models/trainingModel.js";

export const getCourses = async () => {
    return await trainingModel.getAllCourses();
};

export const getCourse = async (id) => {
    return await trainingModel.getCourseById(id);
};