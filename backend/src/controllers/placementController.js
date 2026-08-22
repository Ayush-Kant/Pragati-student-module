import placementService from "../services/placementService.js";
import applicationService from "../services/applicationService.js";
import interviewService from "../services/interviewService.js";
import readinessService from "../services/readinessService.js";
import analyticsService from "../services/analyticsService.js";
import { formatSuccessResponse, formatErrorResponse } from "../utils/placementHelpers.js";

export const getPlacementDashboard = async (req, res, next) => {
  try {
    const dashboard = await placementService.getPlacementDashboard(req.studentId);
    return res.json(formatSuccessResponse(dashboard, "Dashboard retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const getApplications = async (req, res, next) => {
  try {
    const applications = await applicationService.getApplications(req.studentId, req.query);
    return res.json(formatSuccessResponse(applications, "Applications retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const getApplicationById = async (req, res, next) => {
  try {
    const application = await applicationService.getApplicationById(
      req.studentId,
      req.params.applicationId
    );
    return res.json(formatSuccessResponse(application, "Application details retrieved successfully"));
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json(formatErrorResponse(error.message, error.code));
    }
    next(error);
  }
};

export const createApplication = async (req, res, next) => {
  try {
    const application = await applicationService.createApplication(req.studentId, req.body);
    return res
      .status(201)
      .json(formatSuccessResponse(application, "Application created successfully"));
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json(formatErrorResponse(error.message, error.code));
    }
    next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const updatedApp = await applicationService.updateApplicationStatus(
      req.studentId,
      req.params.applicationId,
      req.body.status,
      req.body.note
    );
    return res.json(formatSuccessResponse(updatedApp, "Application status updated successfully"));
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json(formatErrorResponse(error.message, error.code));
    }
    next(error);
  }
};

export const deleteApplication = async (req, res, next) => {
  try {
    const result = await applicationService.deleteApplication(
      req.studentId,
      req.params.applicationId
    );
    return res.json(formatSuccessResponse(result, "Application withdrawn successfully"));
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json(formatErrorResponse(error.message, error.code));
    }
    next(error);
  }
};

export const getInterviews = async (req, res, next) => {
  try {
    const interviews = await interviewService.getInterviews(req.studentId, req.query);
    return res.json(formatSuccessResponse(interviews, "Interviews retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const getInterviewById = async (req, res, next) => {
  try {
    const interview = await interviewService.getInterviewById(
      req.studentId,
      req.params.interviewId
    );
    return res.json(formatSuccessResponse(interview, "Interview details retrieved successfully"));
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json(formatErrorResponse(error.message, error.code));
    }
    next(error);
  }
};

export const createInterview = async (req, res, next) => {
  try {
    const interview = await interviewService.createInterview(req.studentId, req.body);
    return res
      .status(201)
      .json(formatSuccessResponse(interview, "Interview scheduled successfully"));
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json(formatErrorResponse(error.message, error.code));
    }
    next(error);
  }
};

export const updateInterview = async (req, res, next) => {
  try {
    const updatedInterview = await interviewService.updateInterview(
      req.studentId,
      req.params.interviewId,
      req.body
    );
    return res.json(formatSuccessResponse(updatedInterview, "Interview updated successfully"));
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json(formatErrorResponse(error.message, error.code));
    }
    next(error);
  }
};

export const getSkillReadiness = async (req, res, next) => {
  try {
    const skills = await readinessService.getSkillReadiness(req.studentId);
    return res.json(formatSuccessResponse(skills, "Skill readiness retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const getSkillGaps = async (req, res, next) => {
  try {
    const skillGaps = await readinessService.getSkillGaps(req.studentId);
    return res.json(formatSuccessResponse(skillGaps, "Skill gaps retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const getReadinessReport = async (req, res, next) => {
  try {
    const readinessReport = await readinessService.getReadinessReport(req.studentId);
    return res.json(formatSuccessResponse(readinessReport, "Readiness report retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const getPlacementAnalytics = async (req, res, next) => {
  try {
    const analytics = await analyticsService.getPlacementAnalytics(req.studentId);
    return res.json(formatSuccessResponse(analytics, "Placement analytics retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const getCareerRecommendations = async (req, res, next) => {
  try {
    const recommendations = await analyticsService.getCareerRecommendations(req.studentId);
    return res.json(formatSuccessResponse(recommendations, "Career recommendations retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export default {
  getPlacementDashboard,
  getApplications,
  getApplicationById,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
  getInterviews,
  getInterviewById,
  createInterview,
  updateInterview,
  getSkillReadiness,
  getSkillGaps,
  getReadinessReport,
  getPlacementAnalytics,
  getCareerRecommendations,
};
