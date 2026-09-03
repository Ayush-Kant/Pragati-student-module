import api from '../../../../services/api';

const unwrap = (response) => response?.data?.data ?? response?.data;

export const fetchDashboardData = async () => {
  const response = await api.get('/student/dashboard');
  return unwrap(response);
};
