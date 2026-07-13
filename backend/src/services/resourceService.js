import * as resourceModel from "../models/resourceModel.js";

export const getResources = async (lessonId) => {
    return await resourceModel.getResources(lessonId);
};

export const downloadResource = async (resourceId) => {
    return await resourceModel.downloadResource(resourceId);
};