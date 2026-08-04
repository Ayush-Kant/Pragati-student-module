/**
 * Location: backend/services/collegeStatistics.service.js
 */
import * as collegeStatisticsModel from "../models/collegeStatistics.model.js";

/**
 * Gets students statistics (status counts, CGPA distributions).
 */
export const getStudentAnalytics = async (collegeId, query = {}) => {
  const data = await collegeStatisticsModel.getStudentStatistics(collegeId);
  return {
    success: true,
    data,
  };
};

/**
 * Gets placement trend statistics (historic yearly placements).
 */
export const getPlacementTrend = async (collegeId, query = {}) => {
  const data = await collegeStatisticsModel.getPlacementStatistics(collegeId);
  return {
    success: true,
    data,
  };
};

/**
 * Gets hiring trend statistics (placements per month).
 */
export const getHiringTrend = async (collegeId, query = {}) => {
  const data = await collegeStatisticsModel.getHiringStatistics(collegeId);
  return {
    success: true,
    data,
  };
};

export default {
  getStudentAnalytics,
  getPlacementTrend,
  getHiringTrend,
};
