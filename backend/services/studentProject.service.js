import studentProjectModel from '../models/studentProject.model.js';

const notFound = (message = 'Project not found') => { const error = new Error(message); error.statusCode = 404; return error; };
const validationError = (message) => { const error = new Error(message); error.statusCode = 400; return error; };
const ensureHttpsGitHub = (value) => /^https:\/\/github\.com\//i.test(String(value || '').trim());
const ensureHttpsUrl = (value) => !value || /^https:\/\/[^\s]+$/i.test(String(value).trim());

export const listProjects = async (studentId) => studentProjectModel.listProjects(studentId);
export const getProject = async (studentId, projectId) => { const project = await studentProjectModel.getProjectById(studentId, projectId); if (!project) throw notFound(); return project; };
export const getMilestones = async (studentId, projectId) => { const project = await studentProjectModel.getProjectById(studentId, projectId); if (!project) throw notFound(); return studentProjectModel.getMilestones(studentId, projectId); };
export const getMilestoneSubmission = async (studentId, projectId, milestoneId) => { const project = await studentProjectModel.getProjectById(studentId, projectId); if (!project) throw notFound(); return studentProjectModel.getMilestoneSubmission(studentId, projectId, milestoneId); };

export const submitMilestone = async (studentId, projectId, milestoneId, payload) => {
  const project = await studentProjectModel.getProjectById(studentId, projectId);
  if (!project) throw notFound();
  if (!ensureHttpsGitHub(payload.githubUrl)) throw validationError('GitHub URL must start with https://github.com/');
  if (!ensureHttpsUrl(payload.deployedUrl)) throw validationError('Deployment URL must be a valid HTTPS URL');
  const progressNotes = String(payload.progressNotes || '').trim();
  if (!progressNotes) throw validationError('Progress notes are required');
  if (progressNotes.length > 1000) throw validationError('Progress notes must be 1000 characters or fewer');
  const milestones = await studentProjectModel.getMilestones(studentId, projectId);
  const milestone = milestones.find((item) => Number(item.id) === Number(milestoneId));
  if (!milestone) throw notFound('Milestone not found');
  if (milestone.dueDate && new Date(milestone.dueDate).getTime() < Date.now()) {
    const error = new Error('Milestone deadline has passed'); error.statusCode = 400; throw error;
  }
  return studentProjectModel.upsertMilestoneSubmission(studentId, projectId, milestoneId, {
    githubUrl: String(payload.githubUrl).trim(), deployedUrl: payload.deployedUrl ? String(payload.deployedUrl).trim() : null, progressNotes,
  });
};

export const getSubmission = async (studentId, projectId) => { const project = await studentProjectModel.getProjectById(studentId, projectId); if (!project) throw notFound(); return studentProjectModel.getCurrentSubmission(studentId, projectId); };
export const getHistory = async (studentId, projectId) => { const project = await studentProjectModel.getProjectById(studentId, projectId); if (!project) throw notFound(); return studentProjectModel.getSubmissionHistory(studentId, projectId); };

export const submitProject = async (studentId, projectId, payload) => {
  const project = await studentProjectModel.getProjectById(studentId, projectId);
  if (!project) throw notFound();
  if (project.deadline && new Date(project.deadline).getTime() < Date.now()) throw validationError('Project deadline has passed');
  if (!ensureHttpsGitHub(payload.githubUrl)) throw validationError('GitHub URL must start with https://github.com/');
  if (!ensureHttpsUrl(payload.deploymentUrl)) throw validationError('Deployment URL must be a valid HTTPS URL');
  if (payload.reportSizeBytes && Number(payload.reportSizeBytes) > 20 * 1024 * 1024) throw validationError('Project report must be 20MB or smaller');
  return studentProjectModel.createSubmission(studentId, projectId, payload);
};

export const getEvaluation = async (studentId, projectId) => { const project = await studentProjectModel.getProjectById(studentId, projectId); if (!project) throw notFound(); return studentProjectModel.getEvaluation(studentId, projectId); };

export default { listProjects, getProject, getMilestones, getMilestoneSubmission, submitMilestone, getSubmission, getHistory, submitProject, getEvaluation };
