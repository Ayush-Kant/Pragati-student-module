/**
 * Location: backend/controllers/collegeStatistics.controller.js
 */
import * as collegeStatisticsService from "../services/collegeStatistics.service.js";
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

export const getStudentAnalytics = async (req, res, next) => {
  try {
    const collegeId = await getCollegeId(req);
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
    const collegeId = await getCollegeId(req);
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
    const collegeId = await getCollegeId(req);
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
