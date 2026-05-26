import api from "../../../services/api";

export const loginApi = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const registerApi = async (userData , role) => {
  try {
    const response = await api.post('/auth/register', { ...userData, role });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

