import api from '../../../../services/api.js';

export const fetchDashboardData = async () => {
  try {
    const response = await api.get('/college/dashboard');
    return response.data;
  } catch (error) {
    console.error("Dashboard API Error:", error);
    throw error;
  }
};
