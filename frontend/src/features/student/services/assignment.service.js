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
  // Do not set multipart Content-Type manually. Axios/browser must add the boundary
  // parameter for multipart/form-data so multer can parse the upload correctly.
  const response = await api.post(`/student/assignments/${id}/submit`, payload);
  return unwrap(response);
};

export const getAssignmentStatistics = async () => unwrap(await api.get('/student/assignments/statistics'));
