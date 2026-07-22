import api from '../../../services/api';

export const interviewsService = {
  // List interviews
  list: async () => {
    try {
      const response = await api.get('/v1/company/interviews');
      return response.data.interviews || response.data.data;
    } catch (error) {
      console.error('Error listing interviews:', error);
      throw error;
    }
  },

  // Schedule interview
  create: async (data) => {
    try {
      const response = await api.post('/v1/company/interviews', data);
      return response.data;
    } catch (error) {
      console.error('Error scheduling interview:', error);
      throw error;
    }
  },

  // Submit feedback
  submitFeedback: async (id, feedback) => {
    try {
      const response = await api.patch(`/v1/company/interviews/${id}/feedback`, { feedback });
      return response.data;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  },

  // Update result
  updateResult: async (id, result, attendance) => {
    try {
      const response = await api.patch(`/v1/company/interviews/${id}/result`, { result, attendance });
      return response.data;
    } catch (error) {
      console.error('Error updating interview result:', error);
      throw error;
    }
  }
};
