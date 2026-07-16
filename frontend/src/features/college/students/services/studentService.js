import api from '../../../../services/api.js';

// Uses the shared axios instance from src/services/api.js
// which auto-attaches the Bearer token and uses baseURL: http://localhost:5000/api

export const getStudents = async (params = {}) => {
  const res = await api.get('/students', { params });
  return res.data;
};

export const getStudentById = async (id) => {
  const res = await api.get(`/students/${id}`);
  return res.data;
};

export const createStudent = async (studentData) => {
  const res = await api.post('/students', studentData);
  return res.data;
};

export const updateStudent = async (id, studentData) => {
  const res = await api.put(`/students/${id}`, studentData);
  return res.data;
};

export const deleteStudent = async (id) => {
  const res = await api.delete(`/students/${id}`);
  return res.data;
};

export const searchStudents = async (q, params = {}) => {
  const res = await api.get('/students/search', { params: { q, ...params } });
  return res.data;
};

export const filterStudents = async (filters = {}) => {
  const res = await api.get('/students/filter', { params: filters });
  return res.data;
};

export const getStudentStatistics = async (college) => {
  const res = await api.get('/students/statistics', {
    params: college ? { college } : {},
  });
  return res.data;
};