import studentProjectModel from '../models/studentProject.model.js';

const notFound = (message = 'Project not found') => {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
};

export const listProjects = async (studentId) => studentProjectModel.listProjects(studentId);

export const getProject = async (studentId, projectId) => {
  const project = await studentProjectModel.getProjectById(studentId, projectId);
  if (!project) throw notFound();
  return project;
};

export const getMilestones = async (studentId, projectId) => {
  const project = await studentProjectModel.getProjectById(studentId, projectId);
  if (!project) throw notFound();
  return studentProjectModel.getMilestones(studentId, projectId);
};

export const getSubmission = async (studentId, projectId) => {
  const project = await studentProjectModel.getProjectById(studentId, projectId);
  if (!project) throw notFound();
  return studentProjectModel.getCurrentSubmission(studentId, projectId);
};

export const getHistory = async (studentId, projectId) => {
  const project = await studentProjectModel.getProjectById(studentId, projectId);
  if (!project) throw notFound();
  return studentProjectModel.getSubmissionHistory(studentId, projectId);
};

export const submitProject = async (studentId, projectId, payload) => {
  const project = await studentProjectModel.getProjectById(studentId, projectId);
  if (!project) throw notFound();

  if (new Date(project.deadline).getTime() < Date.now()) {
    const error = new Error('Project deadline has passed');
    error.statusCode = 400;
    throw error;
  }

  return studentProjectModel.createSubmission(studentId, projectId, payload);
};

export const getEvaluation = async (studentId, projectId) => {
  const project = await studentProjectModel.getProjectById(studentId, projectId);
  if (!project) throw notFound();
  return studentProjectModel.getEvaluation(studentId, projectId);
};

export default {
  listProjects,
  getProject,
  getMilestones,
  getSubmission,
  getHistory,
  submitProject,
  getEvaluation,
};
