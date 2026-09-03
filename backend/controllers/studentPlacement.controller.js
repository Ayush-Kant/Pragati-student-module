import studentPlacementService from '../services/studentPlacement.service.js';

const getErrorStatus = (error) => Number(error?.statusCode || error?.status || 500);

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
    const studentId = await studentPlacementService.getStudentPlacementDashboard
      ? await import('../utils/studentProfileIdentity.js').then(({ resolveStudentId }) => resolveStudentId(req.user))
      : null;
    const data = await studentPlacementService.getApplications(studentId, req.query);
    return res.status(200).json({ success: true, applications: data });
  } catch (error) {
    return next(error);
  }
};

export const getApplicationById = async (req, res, next) => {
  try {
    const { resolveStudentId } = await import('../utils/studentProfileIdentity.js');
    const studentId = await resolveStudentId(req.user);
    const data = await studentPlacementService.getApplicationById(studentId, req.params.applicationId);
    return res.status(200).json({ success: true, application: data });
  } catch (error) {
    error.statusCode = getErrorStatus(error);
    return next(error);
  }
};

export const createApplication = async (req, res, next) => {
  try {
    const { resolveStudentId } = await import('../utils/studentProfileIdentity.js');
    const studentId = await resolveStudentId(req.user);
    const data = await studentPlacementService.createApplication(studentId, req.body);
    return res.status(201).json({ success: true, application: data });
  } catch (error) {
    return next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { resolveStudentId } = await import('../utils/studentProfileIdentity.js');
    const studentId = await resolveStudentId(req.user);
    const data = await studentPlacementService.updateApplicationStatus(
      studentId,
      req.params.applicationId,
      req.body?.status,
      req.body?.note,
    );
    return res.status(200).json({ success: true, application: data });
  } catch (error) {
    return next(error);
  }
};

export const withdrawApplication = async (req, res, next) => {
  try {
    const { resolveStudentId } = await import('../utils/studentProfileIdentity.js');
    const studentId = await resolveStudentId(req.user);
    const data = await studentPlacementService.withdrawApplication(studentId, req.params.applicationId);
    return res.status(200).json({ success: true, application: data });
  } catch (error) {
    return next(error);
  }
};

export const getInterviews = async (req, res, next) => {
  try {
    const { resolveStudentId } = await import('../utils/studentProfileIdentity.js');
    const studentId = await resolveStudentId(req.user);
    const data = await studentPlacementService.getPlacementInterviews(studentId, req.query);
    return res.status(200).json({ success: true, interviews: data });
  } catch (error) {
    return next(error);
  }
};

export const getSkills = async (req, res, next) => {
  try {
    const { resolveStudentId } = await import('../utils/studentProfileIdentity.js');
    const studentId = await resolveStudentId(req.user);
    const data = await studentPlacementService.getSkillReadiness(studentId);
    return res.status(200).json({ success: true, skills: data });
  } catch (error) {
    return next(error);
  }
};

export const getSkillGaps = async (req, res, next) => {
  try {
    const { resolveStudentId } = await import('../utils/studentProfileIdentity.js');
    const studentId = await resolveStudentId(req.user);
    const data = await studentPlacementService.getSkillGaps(studentId);
    return res.status(200).json({ success: true, gaps: data });
  } catch (error) {
    return next(error);
  }
};

export const getRecommendations = async (req, res, next) => {
  try {
    const { resolveStudentId } = await import('../utils/studentProfileIdentity.js');
    const studentId = await resolveStudentId(req.user);
    const data = await studentPlacementService.getCareerRecommendations(studentId);
    return res.status(200).json({ success: true, recommendations: data });
  } catch (error) {
    return next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const { resolveStudentId } = await import('../utils/studentProfileIdentity.js');
    const studentId = await resolveStudentId(req.user);
    const data = await studentPlacementService.getPlacementAnalytics(studentId);
    return res.status(200).json({ success: true, analytics: data });
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
