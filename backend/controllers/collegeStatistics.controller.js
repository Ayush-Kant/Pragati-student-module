/**
 * Location: backend/controllers/collegeStatistics.controller.js
 */
import * as collegeStatisticsService from "../services/collegeStatistics.service.js";
import { resolveCollegeId } from '../services/collegeContext.service.js';
import { successResponse, errorResponse } from "../utils/responseHandler.js";

/**
 * Helper to fetch collegeId from logged-in user
 */
export const getStudentAnalytics = async (req, res, next) => {
  try {
    const collegeId = await resolveCollegeId(req.user);
    if (!collegeId) {
      return errorResponse(res, "College profile not found.", 404);
    }

    const result = await collegeStatisticsService.getStudentAnalytics(collegeId, req.query);
    return successResponse(res, result.data, "Student analytics statistics fetched successfully.");
  } catch (error) {
    next(error);
  }
};

export const getPlacementTrend = async (req, res, next) => {
  try {
    const collegeId = await resolveCollegeId(req.user);
    if (!collegeId) {
      return errorResponse(res, "College profile not found.", 404);
    }

    const result = await collegeStatisticsService.getPlacementTrend(collegeId, req.query);
    return successResponse(res, result.data, "Placement trends fetched successfully.");
  } catch (error) {
    next(error);
  }
};

export const getHiringTrend = async (req, res, next) => {
  try {
    const collegeId = await resolveCollegeId(req.user);
    if (!collegeId) {
      return errorResponse(res, "College profile not found.", 404);
    }

    const result = await collegeStatisticsService.getHiringTrend(collegeId, req.query);
    return successResponse(res, result.data, "Hiring trends fetched successfully.");
  } catch (error) {
    next(error);
  }
};

export default {
  getStudentAnalytics,
  getPlacementTrend,
  getHiringTrend,
};
