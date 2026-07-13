import * as DriveService from "../services/placementDriveService.js";

// Get all placement drives
export const getPlacementDrives = async (req, res, next) => {
  try {
    const drives = await DriveService.getPlacementDrives();
    res.status(200).json(drives);
  } catch (error) {
    next(error);
  }
};

// Get placement drive by ID
export const getPlacementDriveById = async (req, res, next) => {
  try {
    const drive = await DriveService.getPlacementDrive(req.params.id);
    res.status(200).json(drive);
  } catch (error) {
    next(error);
  }
};

// Create placement drive
export const createPlacementDrive = async (req, res, next) => {
  try {
    const newDrive = await DriveService.addPlacementDrive(req.body);
    res.status(201).json(newDrive);
  } catch (error) {
    next(error);
  }
};

// Update placement drive
export const updatePlacementDrive = async (req, res, next) => {
  try {
    const updatedDrive = await DriveService.editPlacementDrive(
      req.params.id,
      req.body
    );
    res.status(200).json(updatedDrive);
  } catch (error) {
    next(error);
  }
};

// Delete placement drive
export const deletePlacementDrive = async (req, res, next) => {
  try {
    const deletedDrive = await DriveService.removePlacementDrive(req.params.id);

    res.status(200).json({
      success: true,
      message: "Placement Drive deleted successfully",
      data: deletedDrive,
    });
  } catch (error) {
    next(error);
  }
};

// Search placement drives
export const searchPlacementDrives = async (req, res, next) => {
  try {
    const { query } = req.query;

    const results = await DriveService.searchPlacementDrives(query);

    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

// Get placement drive statistics
export const getDriveStatistics = async (req, res, next) => {
  try {
    const stats = await DriveService.getDriveStatistics();
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};