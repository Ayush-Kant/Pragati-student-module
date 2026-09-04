import api from '../../../../services/api';

const unwrap = (response) => response?.data?.data ?? response?.data;
const request = async (promise) => {
  try { const response = await promise; return { success: true, data: unwrap(response), error: null }; }
  catch (error) { return { success: false, data: null, error: error?.response?.data?.message || error?.message || 'Request failed.' }; }
};

export const getProjects = () => request(api.get('/student/projects'));
export const getProjectById = (projectId) => request(api.get(`/student/projects/${projectId}`));
export const getMilestones = (projectId) => request(api.get(`/student/projects/${projectId}/milestones`));
export const getMilestoneSubmission = (projectId, milestoneId) => request(api.get(`/student/projects/${projectId}/milestones/${milestoneId}/submission`));
export const submitMilestone = (projectId, milestoneId, payload) => request(api.post(`/student/projects/${projectId}/milestones/${milestoneId}`, payload));
export const getProjectSubmission = (projectId) => request(api.get(`/student/projects/${projectId}/submission`));

export const submitProject = (projectId, payload) => {
  if (!payload?.reportFile) return request(api.post(`/student/projects/${projectId}/submit`, payload));
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => { if (key !== 'reportFile' && value !== undefined && value !== null) formData.append(key, value); });
  formData.append('report', payload.reportFile);
  return request(api.post(`/student/projects/${projectId}/submit`, formData));
};

export const getSubmissionHistory = (projectId) => request(api.get(`/student/projects/${projectId}/submissions`));
export const uploadProjectFile = async (projectId, file, options = {}) => {
  const formData = new FormData(); formData.append('file', file);
  try { const response = await api.post(`/student/projects/${projectId}/files`, formData, { onUploadProgress: (event) => { if (event.total) options.onProgress?.(Math.round((event.loaded / event.total) * 100)); } }); return { success: true, data: unwrap(response), error: null }; }
  catch (error) { return { success: false, data: null, error: error?.response?.data?.message || error?.message || 'File upload failed.' }; }
};
export const deleteProjectFile = (projectId, fileId) => request(api.delete(`/student/projects/${projectId}/files/${fileId}`));
export const getProjectEvaluation = (projectId) => request(api.get(`/student/projects/${projectId}/evaluation`));

export default { getProjects, getProjectById, getMilestones, getMilestoneSubmission, submitMilestone, getProjectSubmission, submitProject, getSubmissionHistory, uploadProjectFile, deleteProjectFile, getProjectEvaluation };
