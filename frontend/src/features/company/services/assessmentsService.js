import api from '../../../services/api';

export const assessmentsService = {
  // List assessments
  list: async () => {
    try {
      const response = await api.get('/v1/company/assessments');
      return response.data.data;
    } catch (error) {
      console.error('Error listing assessments:', error);
      throw error;
    }
  },

  // Create assessment
  create: async (data) => {
    try {
      // Map UI properties to database columns
      const payload = {
        title: data.title,
        type: data.type || 'MCQ',
        difficulty: data.difficulty || 'Medium',
        time_limit_minutes: parseInt(data.duration, 10) || 60,
        total_marks: parseInt(data.total_marks, 10) || 100,
        status: 'active'
      };
      const response = await api.post('/v1/company/assessments', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating assessment:', error);
      throw error;
    }
  },

  // Get details
  getById: async (id) => {
    try {
      const response = await api.get(`/v1/company/assessments/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching assessment:', error);
      throw error;
    }
  },

  // Update assessment
  update: async (id, data) => {
    try {
      const payload = {
        title: data.title,
        type: data.type || 'MCQ',
        difficulty: data.difficulty || 'Medium',
        time_limit_minutes: parseInt(data.duration, 10) || 60,
        total_marks: parseInt(data.total_marks, 10) || 100,
        status: data.status || 'active'
      };
      const response = await api.put(`/v1/company/assessments/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating assessment:', error);
      throw error;
    }
  },

  // Archive assessment
  archive: async (id) => {
    try {
      const response = await api.delete(`/v1/company/assessments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error archiving assessment:', error);
      throw error;
    }
  },

  // Assign to recruitment drive
  assignToDrive: async (id, driveId) => {
    try {
      const response = await api.patch(`/v1/company/assessments/${id}/assign`, { driveId });
      return response.data;
    } catch (error) {
      console.error('Error assigning assessment:', error);
      throw error;
    }
  }
};
