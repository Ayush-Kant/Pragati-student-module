import * as resourceModel from "../models/resourceModel.js";

export const getResources = async () => {
    return await resourceModel.getResources();
};

export const downloadResource = async (resourceId) => {
    return await resourceModel.downloadResource(resourceId);
};