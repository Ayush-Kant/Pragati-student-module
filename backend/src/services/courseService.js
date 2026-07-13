import * as courseModel from "../models/courseModel.js";

export const getModules = async (courseId) => {
    return await courseModel.getCourseModules(courseId);
};

export const getModule = async (moduleId) => {
    return await courseModel.getModuleDetails(moduleId);
};