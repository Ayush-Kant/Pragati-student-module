import api from '../../../services/api';

const unwrap = (response) => response?.data?.data ?? response?.data;

export const getAssignments = async ({ status } = {}) => {
  const response = await api.get('/assignments', {
    params: status ? { status } : undefined,
  });
  return unwrap(response);
};

export const getAssignmentById = async (id) => {
  const response = await api.get(`/assignments/${id}`);
  return unwrap(response);
};

export const getAssignmentSubmission = async (id) => {
  const response = await api.get(`/assignments/${id}/submission`);
  return unwrap(response);
};

export const submitAssignment = async (id, payload) => {
  const response = await api.post(`/assignments/${id}/submit`, payload);
  return unwrap(response);
};

export const getAssignmentStatistics = async () => {
  const response = await api.get('/assignments/statistics');
  return unwrap(response);
};
