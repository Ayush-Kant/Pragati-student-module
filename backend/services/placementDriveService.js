import * as DriveModel from "../models/placementDriveModel.js";

export const getPlacementDrives = async () => {
  return await DriveModel.getAllPlacementDrives();
};

export const getPlacementDrive = async (id) => {
  const drive = await DriveModel.getPlacementDriveById(id);
  if (!drive) {
    const error = new Error("Placement Drive not found");
    error.statusCode = 404;
    throw error;
  }
  return drive;
};

export const addPlacementDrive = async (data) => {
  return await DriveModel.createPlacementDrive(data);
};

export const editPlacementDrive = async (id, data) => {
  const drive = await DriveModel.getPlacementDriveById(id);
  if (!drive) {
    const error = new Error("Placement Drive not found");
    error.statusCode = 404;
    throw error;
  }
  return await DriveModel.updatePlacementDrive(id, data);
};

export const removePlacementDrive = async (id) => {
  const drive = await DriveModel.getPlacementDriveById(id);
  if (!drive) {
    const error = new Error("Placement Drive not found");
    error.statusCode = 404;
    throw error;
  }
  return await DriveModel.deletePlacementDrive(id);
};

export const searchPlacementDrives = async (query) => {
  if (!query) return await DriveModel.getAllPlacementDrives();
  return await DriveModel.searchPlacementDrives(query);
};

export const getDriveStatistics = async () => {
  return await DriveModel.getDriveStatistics();
};
