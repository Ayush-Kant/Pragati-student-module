import { placementDriveApiResponse } from "../types/placementDriveDummyData";

/**
 * Fetch all placement drives
 */
export const getPlacementDrives = async () => {
  return Promise.resolve(placementDriveApiResponse);
};

/**
 * Fetch a single placement drive by ID
 */
export const getPlacementDriveById = async (id) => {
  const drive = placementDriveApiResponse.data.find(
    (item) => item.id === Number(id)
  );

  return Promise.resolve({
    success: !!drive,
    data: drive || null,
  });
};

/**
 * Create a placement drive
 */
export const createPlacementDrive = async (drive) => {
  return Promise.resolve({
    success: true,
    data: drive,
  });
};

/**
 * Update a placement drive
 */
export const updatePlacementDrive = async (id, updatedDrive) => {
  return Promise.resolve({
    success: true,
    data: {
      id,
      ...updatedDrive,
    },
  });
};

/**
 * Delete a placement drive
 */
export const deletePlacementDrive = async (id) => {
  return Promise.resolve({
    success: true,
    message: `Placement drive ${id} deleted successfully.`,
  });
};