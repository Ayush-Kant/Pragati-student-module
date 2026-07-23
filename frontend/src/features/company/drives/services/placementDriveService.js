import apiClient from "../../../../services/api.js";

export const placementDriveService = {
  // GET all placement drives
  getPlacementDrives: async () => {
    const response = await apiClient.get("/placement-drives");
    return response.data;
  },

  // GET placement drive by ID
  getPlacementDriveById: async (id) => {
    const response = await apiClient.get(`/placement-drives/${id}`);
    return response.data;
  },

  // POST create placement drive
  createPlacementDrive: async (data) => {
    const response = await apiClient.post("/placement-drives", data);
    return response.data;
  },

  // PUT update placement drive
  updatePlacementDrive: async (id, data) => {
    const response = await apiClient.put(`/placement-drives/${id}`, data);
    return response.data;
  },

  // DELETE placement drive
  deletePlacementDrive: async (id) => {
    const response = await apiClient.delete(`/placement-drives/${id}`);
    return response.data;
  },
};
