import api from '../../../services/api';

const unwrap = (response) => response?.data?.data ?? response?.data;

export const getAssignments = async ({ status } = {}) => {
  const response = await api.get('/student/assignments', { params: status ? { status } : undefined });
  return unwrap(response);
};

export const getAssignmentById = async (id) => unwrap(await api.get(`/student/assignments/${id}`));
export const getAssignmentSubmission = async (id) => unwrap(await api.get(`/student/assignments/${id}/submission`));
export const getAssignmentSubmissions = async () => unwrap(await api.get('/student/assignments/submissions'));

export const submitAssignment = async (id, payload) => {
  const isForm = typeof FormData !== 'undefined' && payload instanceof FormData;
  const response = await api.post(`/student/assignments/${id}/submit`, payload, isForm ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined);
  return unwrap(response);
};

export const getAssignmentStatistics = async () => unwrap(await api.get('/student/assignments/statistics'));
