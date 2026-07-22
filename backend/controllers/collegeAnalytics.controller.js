/**
 * Location: backend/controllers/collegeAnalytics.controller.js
 */
import * as collegeAnalyticsService from "../services/collegeAnalytics.service.js";
import { resolveUserIntId } from "../utils/userResolver.js";
import { pool } from "../config/db.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";

/**
 * Helper to fetch collegeId from logged-in user
 */
const getCollegeId = async (req) => {
  const intUserId = await resolveUserIntId(req.user.userId);
  if (!intUserId) return null;

  const result = await pool.query(
    "SELECT id FROM colleges WHERE user_id = $1",
    [intUserId]
  );
  return result.rows[0]?.id || null;
};


console.log("ENTERED DASHBOARD CONTROLLER");
export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const collegeId = await getCollegeId(req);
    if (!collegeId) {
      return errorResponse(res, "College profile not found for logged in user.", 404);
    }

    const result = await collegeAnalyticsService.getDashboardAnalytics(collegeId, req.query);
    return successResponse(res, result.data, "Dashboard analytics fetched successfully.");
  } catch (error) {
    next(error);
  }
};

export const getOverviewStatistics = async (req, res, next) => {
  try {
    const collegeId = await getCollegeId(req);
    if (!collegeId) {
      return errorResponse(res, "College profile not found.", 404);
    }

    const result = await collegeAnalyticsService.getOverviewStatistics(collegeId, req.query);
    return successResponse(res, result.data, "Overview statistics fetched successfully.");
  } catch (error) {
    next(error);
  }
};

export const getPlacementAnalytics = async (req, res, next) => {
  try {
    const collegeId = await getCollegeId(req);
    if (!collegeId) {
      return errorResponse(res, "College profile not found.", 404);
    }

    const result = await collegeAnalyticsService.getPlacementAnalytics(collegeId, req.query);
    return successResponse(res, result.data, "Placement analytics fetched successfully.");
  } catch (error) {
    next(error);
  }
};

export const getCompanyAnalytics = async (req, res, next) => {
  try {
    const collegeId = await getCollegeId(req);
    if (!collegeId) {
      return errorResponse(res, "College profile not found.", 404);
    }

    const result = await collegeAnalyticsService.getCompanyAnalytics(collegeId, req.query);
    return successResponse(res, result.data, "Company analytics fetched successfully.");
  } catch (error) {
    next(error);
  }
};

export const getDepartmentAnalytics = async (req, res, next) => {
  try {
    const collegeId = await getCollegeId(req);
    if (!collegeId) {
      return errorResponse(res, "College profile not found.", 404);
    }

    const result = await collegeAnalyticsService.getDepartmentAnalytics(collegeId, req.query);
    return successResponse(res, result.data, "Department analytics fetched successfully.");
  } catch (error) {
    next(error);
  }
};

export default {
  getDashboardAnalytics,
  getOverviewStatistics,
  getPlacementAnalytics,
  getCompanyAnalytics,
  getDepartmentAnalytics,
};
