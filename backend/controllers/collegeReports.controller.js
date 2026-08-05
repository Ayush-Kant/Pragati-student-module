import * as service from '../services/collegeReports.service.js';
import { resolveCollegeId } from '../services/collegeContext.service.js';
import { resolveUserIntId } from '../utils/userResolver.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

const getReports = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: await service.listReports(req.query) });
  } catch (error) {
    next(error);
  }
};

const generateReport = async (req, res, next) => {
  try {
    let rawUserId = req.user?.id || req.user?.uid || req.user?.userId || null;
    let userId = null;
    if (rawUserId) {
      userId = await resolveUserIntId(rawUserId);
    }
    res.status(201).json({ success: true, data: await service.generateReport(req.body, userId) });
  } catch (error) {
    next(error);
  }
};

const getReportById = async (req, res, next) => {
  try {
    const report = await service.getReportById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found', data: null });
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

const deleteReport = async (req, res, next) => {
  try {
    const deleted = await service.deleteReport(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Report not found', data: null });
    res.status(200).json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const previewReport = async (req, res, next) => {
  try {
    const preview = await service.previewReport(req.params.id);
    if (!preview) return res.status(404).json({ success: false, message: 'Report not found', data: null });
    res.status(200).json({ success: true, data: preview });
  } catch (error) {
    next(error);
  }
};

const downloadReport = async (req, res, next) => {
  try {
    const result = await service.downloadReport(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Report not found', data: null });
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    return res.send(result.buffer);
  } catch (error) {
    next(error);
  }
};

const exportAnalytics = async (req, res, next) => {
  try {
    const collegeId = await resolveCollegeId(req.user);
    if (!collegeId) return errorResponse(res, 'College profile not found.', 404);
    const format = req.path.includes('pdf') ? 'pdf' : 'excel';
    const result = await service.exportAnalytics(collegeId, format, req.query.reportType, req.query);
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    return res.send(result.content);
  } catch (error) {
    next(error);
  }
};

const getAnalyticsReport = (reportType, message) => async (req, res, next) => {
  try {
    const collegeId = await resolveCollegeId(req.user);
    if (!collegeId) return errorResponse(res, 'College profile not found.', 404);
    const result = await service.exportAnalytics(collegeId, 'excel', reportType, req.query);
    return successResponse(res, { report: result.content, filename: result.filename }, message);
  } catch (error) {
    next(error);
  }
};

const getCompanyReport = getAnalyticsReport('companies', 'Company report generated successfully.');
const getDepartmentReport = getAnalyticsReport('departments', 'Department report generated successfully.');
const getStudentReport = getAnalyticsReport('students', 'Student report generated successfully.');

export {
  getReports,
  generateReport,
  getReportById,
  deleteReport,
  previewReport,
  downloadReport,
  exportAnalytics,
  getCompanyReport,
  getDepartmentReport,
  getStudentReport,
};
export default {
  getReports,
  generateReport,
  getReportById,
  deleteReport,
  previewReport,
  downloadReport,
  exportAnalytics,
  getCompanyReport,
  getDepartmentReport,
  getStudentReport,
};
