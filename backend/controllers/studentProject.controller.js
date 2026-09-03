import studentProjectService from '../services/studentProject.service.js';
import { resolveStudentId } from '../utils/studentProfileIdentity.js';

const parsePositiveId = (value, field) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    const error = new Error(`${field} must be a positive integer`);
    error.statusCode = 400;
    throw error;
  }
  return parsed;
};

const send = (res, data) => res.status(200).json({ success: true, data });

export const listProjects = async (req, res, next) => {
  try {
    const studentId = await resolveStudentId(req.user);
    send(res, await studentProjectService.listProjects(studentId));
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req, res, next) => {
  try {
    const studentId = await resolveStudentId(req.user);
    const projectId = parsePositiveId(req.params.projectId, 'projectId');
    send(res, await studentProjectService.getProject(studentId, projectId));
  } catch (error) {
    next(error);
  }
};

export const getMilestones = async (req, res, next) => {
  try {
    const studentId = await resolveStudentId(req.user);
    const projectId = parsePositiveId(req.params.projectId, 'projectId');
    send(res, await studentProjectService.getMilestones(studentId, projectId));
  } catch (error) {
    next(error);
  }
};

export const getSubmission = async (req, res, next) => {
  try {
    const studentId = await resolveStudentId(req.user);
    const projectId = parsePositiveId(req.params.projectId, 'projectId');
    send(res, await studentProjectService.getSubmission(studentId, projectId));
  } catch (error) {
    next(error);
  }
};

export const getSubmissionHistory = async (req, res, next) => {
  try {
    const studentId = await resolveStudentId(req.user);
    const projectId = parsePositiveId(req.params.projectId, 'projectId');
    send(res, await studentProjectService.getHistory(studentId, projectId));
  } catch (error) {
    next(error);
  }
};

export const submitProject = async (req, res, next) => {
  try {
    const studentId = await resolveStudentId(req.user);
    const projectId = parsePositiveId(req.params.projectId, 'projectId');
    const { githubUrl, deploymentUrl, description, documentation, reportUrl, additionalComments } = req.body || {};

    if (!githubUrl || !/^https?:\/\//i.test(githubUrl)) {
      const error = new Error('A valid GitHub repository URL is required');
      error.statusCode = 400;
      throw error;
    }

    send(
      res,
      await studentProjectService.submitProject(studentId, projectId, {
        githubUrl,
        deploymentUrl,
        description,
        documentation,
        reportUrl,
        additionalComments,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const getEvaluation = async (req, res, next) => {
  try {
    const studentId = await resolveStudentId(req.user);
    const projectId = parsePositiveId(req.params.projectId, 'projectId');
    send(res, await studentProjectService.getEvaluation(studentId, projectId));
  } catch (error) {
    next(error);
  }
};
