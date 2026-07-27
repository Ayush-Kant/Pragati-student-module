import * as resourceModel from "../models/resourceModel.js";

export const getResources = async (lessonId) => {
    return await resourceModel.getResources(lessonId);
};

export const getResourcesByCourse = async (courseId) => {
    return await resourceModel.getResourcesByCourse(courseId);
};

export const downloadResource = async (resourceId) => {
    return await resourceModel.downloadResource(resourceId);
};