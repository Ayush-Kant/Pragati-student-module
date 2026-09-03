import api from './api';

const unwrap = (response) => response?.data ?? response;

export const getPerformance = async (driveId = null) => {
  const endpoint = driveId ? `/student/performance/${driveId}` : '/student/performance';
  return unwrap(await api.get(endpoint));
};

export const getSubmissionHistory = async ({ type, page = 1, limit = 10 } = {}) => {
  const params = { page, limit };
  if (type && type !== 'all') params.type = type;
  return unwrap(await api.get('/student/performance/submissions', { params }));
};

export default { getPerformance, getSubmissionHistory };
