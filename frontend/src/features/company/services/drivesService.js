import api from '../../../services/api';

export const drivesService = {
  listDrives: async () => {
    try {
      const response = await api.get('/v1/company/drives');
      return response.data.data;
    } catch (error) {
      console.error('Error listing drives:', error);
      throw error;
    }
  },

  createDrive: async (driveData) => {
    try {
      const response = await api.post('/v1/company/drives', driveData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating drive:', error);
      throw error;
    }
  },

  getDriveById: async (driveId) => {
    try {
      const response = await api.get(`/v1/company/drives/${driveId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting drive details:', error);
      throw error;
    }
  },

  updateDrive: async (driveId, driveData) => {
    try {
      const response = await api.put(`/v1/company/drives/${driveId}`, driveData);
      return response.data;
    } catch (error) {
      console.error('Error updating drive:', error);
      throw error;
    }
  },

  closeDrive: async (driveId) => {
    try {
      const response = await api.patch(`/v1/company/drives/${driveId}/close`);
      return response.data;
    } catch (error) {
      console.error('Error closing drive:', error);
      throw error;
    }
  },

  pauseDrive: async (driveId) => {
    try {
      const response = await api.patch(`/v1/company/drives/${driveId}/pause`);
      return response.data;
    } catch (error) {
      console.error('Error pausing drive:', error);
      throw error;
    }
  },

  listCandidates: async (driveId) => {
    try {
      const response = await api.get(`/v1/company/drives/${driveId}/candidates`);
      return response.data.data;
    } catch (error) {
      console.error('Error listing drive candidates:', error);
      throw error;
    }
  }
};
