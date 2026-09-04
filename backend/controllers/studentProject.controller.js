import fs from 'node:fs';
import studentProjectService from '../services/studentProject.service.js';
import { resolveStudentId } from '../utils/studentProfileIdentity.js';

const parsePositiveId = (value, field) => { const parsed = Number(value); if (!Number.isInteger(parsed) || parsed <= 0) { const error = new Error(`${field} must be a positive integer`); error.statusCode = 400; throw error; } return parsed; };
const send = (res, data) => res.status(200).json({ success: true, data });
const projectReportUrl = (req) => req.file ? `${req.protocol}://${req.get('host')}/uploads/projects/${req.file.filename}` : null;

export const listProjects = async (req, res, next) => { try { const studentId = await resolveStudentId(req.user); send(res, await studentProjectService.listProjects(studentId)); } catch (error) { next(error); } };
export const getProject = async (req, res, next) => { try { const studentId = await resolveStudentId(req.user); send(res, await studentProjectService.getProject(studentId, parsePositiveId(req.params.projectId, 'projectId'))); } catch (error) { next(error); } };
export const getMilestones = async (req, res, next) => { try { const studentId = await resolveStudentId(req.user); send(res, await studentProjectService.getMilestones(studentId, parsePositiveId(req.params.projectId, 'projectId'))); } catch (error) { next(error); } };
export const getMilestoneSubmission = async (req, res, next) => { try { const studentId = await resolveStudentId(req.user); send(res, await studentProjectService.getMilestoneSubmission(studentId, parsePositiveId(req.params.projectId, 'projectId'), parsePositiveId(req.params.milestoneId, 'milestoneId'))); } catch (error) { next(error); } };
export const submitMilestone = async (req, res, next) => { try { const studentId = await resolveStudentId(req.user); send(res, await studentProjectService.submitMilestone(studentId, parsePositiveId(req.params.projectId, 'projectId'), parsePositiveId(req.params.milestoneId, 'milestoneId'), { githubUrl: req.body?.githubUrl, deployedUrl: req.body?.deployedUrl, progressNotes: req.body?.progressNotes })); } catch (error) { next(error); } };
export const getSubmission = async (req, res, next) => { try { const studentId = await resolveStudentId(req.user); send(res, await studentProjectService.getSubmission(studentId, parsePositiveId(req.params.projectId, 'projectId'))); } catch (error) { next(error); } };
export const getSubmissionHistory = async (req, res, next) => { try { const studentId = await resolveStudentId(req.user); send(res, await studentProjectService.getHistory(studentId, parsePositiveId(req.params.projectId, 'projectId'))); } catch (error) { next(error); } };

export const submitProject = async (req, res, next) => {
  try {
    const studentId = await resolveStudentId(req.user);
    const projectId = parsePositiveId(req.params.projectId, 'projectId');
    const reportUrl = req.file ? projectReportUrl(req) : (req.body?.reportUrl || null);
    const data = await studentProjectService.submitProject(studentId, projectId, {
      githubUrl: req.body?.githubUrl,
      deploymentUrl: req.body?.deploymentUrl,
      description: req.body?.description,
      documentation: req.body?.documentation,
      reportUrl,
      additionalComments: req.body?.additionalComments,
      reportMimeType: req.file?.mimetype || req.body?.reportMimeType || null,
      reportSizeBytes: req.file?.size || Number(req.body?.reportSizeBytes || 0) || null,
    });
    send(res, data);
  } catch (error) {
    if (req.file?.path) fs.rm(req.file.path, { force: true }, () => {});
    next(error);
  }
};

export const getEvaluation = async (req, res, next) => { try { const studentId = await resolveStudentId(req.user); send(res, await studentProjectService.getEvaluation(studentId, parsePositiveId(req.params.projectId, 'projectId'))); } catch (error) { next(error); } };
