import api from "../../../services/api";

export const loginApi = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    console.log(response.data);
    return response.data;
  } catch (error) {
    const errro_message =  error.response?.data?.message || 'Network error';
    return { success: false, message: errro_message };
  }
};

export const registerApi = async (userData , role) => {
  try {
    const response = await api.post('/auth/register', { ...userData, role });
    return response.data;
  } catch (error) {
    const errro_message =  error.response ? error.response.data : 'Network error';
    return { success: false, message: errro_message };
  }
};

