import studentPlacementService from '../services/studentPlacement.service.js';
import { resolveStudentId } from '../utils/studentProfileIdentity.js';

export const getDashboard = async (req, res, next) => {
  try {
    const data = await studentPlacementService.getPlacementDashboard(req.user);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

export const getApplications = async (req, res, next) => {
  try {
    const studentId = await resolveStudentId(req.user);
    const applications = await studentPlacementService.getApplications(studentId, req.query);
    return res.status(200).json({ success: true, applications });
  } catch (error) {
    return next(error);
  }
};

export const getApplicationById = async (req, res, next) => {
  try {
    const studentId = await resolveStudentId(req.user);
    const application = await studentPlacementService.getApplicationById(studentId, req.params.applicationId);
    return res.status(200).json({ success: true, application });
  } catch (error) {
    return next(error);
  }
};

export const createApplication = async (req, res, next) => {
  try {
    const studentId = await resolveStudentId(req.user);
    const application = await studentPlacementService.createApplication(studentId, req.body);
    return res.status(201).json({ success: true, application });
  } catch (error) {
    return next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const studentId = await resolveStudentId(req.user);
    const application = await studentPlacementService.updateApplicationStatus(
      studentId,
      req.params.applicationId,
      req.body?.status,
      req.body?.note,
    );
    return res.status(200).json({ success: true, application });
  } catch (error) {
    return next(error);
  }
};

export const withdrawApplication = async (req, res, next) => {
  try {
    const studentId = await resolveStudentId(req.user);
    const application = await studentPlacementService.withdrawApplication(studentId, req.params.applicationId);
    return res.status(200).json({ success: true, application });
  } catch (error) {
    return next(error);
  }
};

export const getInterviews = async (req, res, next) => {
  try {
    const studentId = await resolveStudentId(req.user);
    const interviews = await studentPlacementService.getPlacementInterviews(studentId, req.query);
    return res.status(200).json({ success: true, interviews });
  } catch (error) {
    return next(error);
  }
};

export const getSkills = async (req, res, next) => {
  try {
    const studentId = await resolveStudentId(req.user);
    const skills = await studentPlacementService.getSkillReadiness(studentId);
    return res.status(200).json({ success: true, skills });
  } catch (error) {
    return next(error);
  }
};

export const getSkillGaps = async (req, res, next) => {
  try {
    const studentId = await resolveStudentId(req.user);
    const gaps = await studentPlacementService.getSkillGaps(studentId);
    return res.status(200).json({ success: true, gaps });
  } catch (error) {
    return next(error);
  }
};

export const getRecommendations = async (req, res, next) => {
  try {
    const studentId = await resolveStudentId(req.user);
    const recommendations = await studentPlacementService.getCareerRecommendations(studentId);
    return res.status(200).json({ success: true, recommendations });
  } catch (error) {
    return next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const studentId = await resolveStudentId(req.user);
    const analytics = await studentPlacementService.getPlacementAnalytics(studentId);
    return res.status(200).json({ success: true, analytics });
  } catch (error) {
    return next(error);
  }
};

export default {
  getDashboard,
  getApplications,
  getApplicationById,
  createApplication,
  updateApplicationStatus,
  withdrawApplication,
  getInterviews,
  getSkills,
  getSkillGaps,
  getRecommendations,
  getAnalytics,
};
