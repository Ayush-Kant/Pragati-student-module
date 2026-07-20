import api from '../../../services/api';

export const dashboardService = {
  getStats: async () => {
    try {
      const response = await api.get('/v1/company/dashboard/stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  getFunnel: async () => {
    try {
      const response = await api.get('/v1/company/dashboard/funnel');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard funnel:', error);
      throw error;
    }
  },

  getCollegeStats: async () => {
    try {
      const response = await api.get('/v1/company/dashboard/college-stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard college stats:', error);
      throw error;
    }
  },

  getActivity: async () => {
    try {
      const response = await api.get('/v1/company/dashboard/activity');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard activity:', error);
      throw error;
    }
  }
};
