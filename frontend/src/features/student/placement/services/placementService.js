import api from '../../../services/api';

const unwrap = (response) => response?.data ?? response;

export const getPlacementDashboard = async () => unwrap(await api.get('/student/placement/dashboard'));
export const getApplications = async (params = {}) => unwrap(await api.get('/student/placement/applications', { params }));
export const getApplication = async (applicationId) => unwrap(await api.get(`/student/placement/applications/${applicationId}`));
export const createApplication = async (payload) => unwrap(await api.post('/student/placement/applications', payload));
export const updateApplicationStatus = async (applicationId, status, note = '') => unwrap(await api.patch(`/student/placement/applications/${applicationId}/status`, { status, note }));
export const withdrawApplication = async (applicationId) => unwrap(await api.delete(`/student/placement/applications/${applicationId}`));
export const getInterviews = async (params = {}) => unwrap(await api.get('/student/placement/interviews', { params }));
export const getSkillReadiness = async () => unwrap(await api.get('/student/placement/skills'));
export const getSkillGaps = async () => unwrap(await api.get('/student/placement/skills/gaps'));
export const getAnalytics = async () => unwrap(await api.get('/student/placement/analytics'));
export const getRecommendations = async () => unwrap(await api.get('/student/placement/recommendations'));

export default {
  getPlacementDashboard,
  getApplications,
  getApplication,
  createApplication,
  updateApplicationStatus,
  withdrawApplication,
  getInterviews,
  getSkillReadiness,
  getSkillGaps,
  getAnalytics,
  getRecommendations,
};
