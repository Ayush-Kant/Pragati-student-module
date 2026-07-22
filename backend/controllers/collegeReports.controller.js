/**
 * Location: backend/controllers/collegeReports.controller.js
 */
import * as collegeReportsService from "../services/collegeReports.service.js";
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

/**
 * Handles PDF and Excel exports.
 * Sets appropriate download headers and sends file buffer/contents.
 */
export const exportAnalytics = async (req, res, next) => {
  try {
    const collegeId = await getCollegeId(req);
    if (!collegeId) {
      return errorResponse(res, "College profile not found.", 404);
    }

    // Identify format based on URL path or default to excel
    const format = req.path.includes("pdf") ? "pdf" : "excel";
    const { reportType } = req.query;

    const result = await collegeReportsService.exportAnalytics(collegeId, format, reportType, req.query);

    res.setHeader("Content-Type", result.contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${result.filename}"`);
    return res.send(result.content);
  } catch (error) {
    next(error);
  }
};

export const getCompanyReport = async (req, res, next) => {
  try {
    const collegeId = await getCollegeId(req);
    if (!collegeId) {
      return errorResponse(res, "College profile not found.", 404);
    }

    const result = await collegeReportsService.exportAnalytics(collegeId, "excel", "companies", req.query);
    return successResponse(res, { report: result.content, filename: result.filename }, "Company report generated successfully.");
  } catch (error) {
    next(error);
  }
};

export const getDepartmentReport = async (req, res, next) => {
  try {
    const collegeId = await getCollegeId(req);
    if (!collegeId) {
      return errorResponse(res, "College profile not found.", 404);
    }

    const result = await collegeReportsService.exportAnalytics(collegeId, "excel", "departments", req.query);
    return successResponse(res, { report: result.content, filename: result.filename }, "Department report generated successfully.");
  } catch (error) {
    next(error);
  }
};

export const getStudentReport = async (req, res, next) => {
  try {
    const collegeId = await getCollegeId(req);
    if (!collegeId) {
      return errorResponse(res, "College profile not found.", 404);
    }

    const result = await collegeReportsService.exportAnalytics(collegeId, "excel", "students", req.query);
    return successResponse(res, { report: result.content, filename: result.filename }, "Student report generated successfully.");
  } catch (error) {
    next(error);
  }
};

export default {
  exportAnalytics,
  getCompanyReport,
  getDepartmentReport,
  getStudentReport,
};
