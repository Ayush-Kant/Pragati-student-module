import * as service from '../services/collegeReports.service.js';
import { resolveUserIntId } from '../utils/userResolver.js';
import { pool } from '../config/db.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

const getCollegeId = async (req) => {
  const userId = req.user?.userId || req.user?.id;
  const intUserId = await resolveUserIntId(userId);
  if (!intUserId) return null;
  const result = await pool.query('SELECT id FROM colleges WHERE user_id = $1', [intUserId]);
  return result.rows[0]?.id || null;
};

const getReports = async (req, res, next) => {
  try { res.status(200).json({ success: true, data: await service.listReports(req.query) }); } catch (error) { next(error); }
};
const generateReport = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id || null;
    res.status(201).json({ success: true, data: await service.generateReport(req.body, userId) });
  } catch (error) { next(error); }
};
const getReportById = async (req, res, next) => {
  try {
    const report = await service.getReportById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.status(200).json({ success: true, data: report });
  } catch (error) { next(error); }
};
const deleteReport = async (req, res, next) => {
  try {
    const deleted = await service.deleteReport(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Report not found' });
    res.status(200).json({ success: true, message: 'Report deleted successfully' });
  } catch (error) { next(error); }
};
const previewReport = async (req, res, next) => {
  try {
    const preview = await service.previewReport(req.params.id);
    if (!preview) return res.status(404).json({ success: false, message: 'Report not found' });
    res.status(200).json({ success: true, data: preview });
  } catch (error) { next(error); }
};
const downloadReport = async (req, res, next) => {
  try {
    const download = await service.downloadReport(req.params.id);
    if (!download) return res.status(404).json({ success: false, message: 'Report not found' });
    res.status(200).json({ success: true, data: download });
  } catch (error) { next(error); }
};

const exportAnalytics = async (req, res, next) => {
  try {
    const collegeId = await getCollegeId(req);
    if (!collegeId) return errorResponse(res, 'College profile not found.', 404);
    const format = req.path.includes('pdf') ? 'pdf' : 'excel';
    const result = await service.exportAnalytics(collegeId, format, req.query.reportType, req.query);
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    return res.send(result.content);
  } catch (error) { next(error); }
};
const getAnalyticsReport = (reportType, message) => async (req, res, next) => {
  try {
    const collegeId = await getCollegeId(req);
    if (!collegeId) return errorResponse(res, 'College profile not found.', 404);
    const result = await service.exportAnalytics(collegeId, 'excel', reportType, req.query);
    return successResponse(res, { report: result.content, filename: result.filename }, message);
  } catch (error) { next(error); }
};
const getCompanyReport = getAnalyticsReport('companies', 'Company report generated successfully.');
const getDepartmentReport = getAnalyticsReport('departments', 'Department report generated successfully.');
const getStudentReport = getAnalyticsReport('students', 'Student report generated successfully.');

export { getReports, generateReport, getReportById, deleteReport, previewReport, downloadReport, exportAnalytics, getCompanyReport, getDepartmentReport, getStudentReport };
export default { getReports, generateReport, getReportById, deleteReport, previewReport, downloadReport, exportAnalytics, getCompanyReport, getDepartmentReport, getStudentReport };
