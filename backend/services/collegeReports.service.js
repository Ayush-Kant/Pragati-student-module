import * as model from '../models/collegeReports.model.js';
import { buildReportPayload, buildReportSummary, buildDynamicReportContent } from '../utils/reportGenerator.js';
import { convertToCSV, convertToHTMLReport } from '../utils/exportHelper.js';
import { exportReport } from './collegeReportExports.service.js';

const listReports = async (filters = {}) => {
  const page = Number.parseInt(filters.page, 10) || 1;
  const limit = Number.parseInt(filters.limit, 10) || 20;
  const offset = (page - 1) * limit;
  const [reports, total] = await Promise.all([
    model.getReports({ ...filters, limit, offset }),
    model.countReports(filters),
  ]);
  return { reports, page, limit, total };
};

const generateReport = async (payload = {}, userId = null) => {
  const report = await model.createReport(
    buildReportPayload({ ...payload, createdBy: userId, status: 'completed' })
  );
  await model.createHistoryEntry({ reportId: report.id, action: 'generated' });
  return report;
};

const getReportById = (id) => model.getReportById(id);

const deleteReport = async (id) => {
  await model.createHistoryEntry({ reportId: Number(id), action: 'deleted' });
  return model.deleteReport(id);
};

const previewReport = async (id) => {
  const report = await model.getReportById(id);
  if (!report) return null;

  const rawContent = typeof report.content === 'string' ? JSON.parse(report.content || '{}') : (report.content || {});
  const enriched = buildDynamicReportContent(rawContent, report.type, report.title);

  return {
    ...buildReportSummary(report),
    preview: true,
    title: report.title || 'Generated Report',
    type: report.type ? (report.type.charAt(0).toUpperCase() + report.type.slice(1)) : 'Placement',
    generatedOn: report.createdAt ? (typeof report.createdAt === 'string' ? report.createdAt.split('T')[0] : new Date(report.createdAt).toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
    generatedBy: enriched.generatedBy,
    description: enriched.description,
    filtersApplied: enriched.filtersApplied,
    summary: enriched.summary,
    records: enriched.records,
    chartData: enriched.chartData,
    content: enriched,
  };
};

/**
 * Downloads a report file buffer and logs 'downloaded' action to report_history.
 */
const downloadReport = async (id) => {
  const report = await model.getReportById(id);
  if (!report) return null;

  const result = await exportReport(id, report.format || 'csv');

  // Log downloaded event to history
  await model.createHistoryEntry({ reportId: Number(id), action: 'downloaded' });

  return result;
};

const getMonthlyReport = async (collegeId, query = {}) => ({
  success: true,
  data: await model.getMonthlyReport(collegeId, query),
});

const getYearlyReport = async (collegeId, query = {}) => ({
  success: true,
  data: await model.getYearlyReport(collegeId, query),
});

const reportColumns = {
  placements: [
    ['year', 'total_students', 'total_placed', 'placement_rate', 'average_package', 'highest_package'],
    ['Year', 'Total Students', 'Total Placed', 'Placement Rate (%)', 'Average Package (LPA)', 'Highest Package (LPA)'],
  ],
  companies: [
    ['company_name', 'total_hired', 'average_package'],
    ['Company Name', 'Total Students Placed', 'Average Salary Package (LPA)'],
  ],
  departments: [
    ['department_name', 'department_code', 'total_students', 'total_placed', 'placement_rate', 'average_package'],
    ['Department Name', 'Code', 'Total Students', 'Placed Students', 'Placement Rate (%)', 'Average Salary Package (LPA)'],
  ],
  students: [
    ['enrollment_no', 'name', 'email', 'department', 'course', 'cgpa', 'placement_status', 'placed_at', 'package'],
    ['Enrollment Number', 'Student Name', 'Email ID', 'Department', 'Course', 'CGPA', 'Status', 'Placed At Company', 'Salary Package'],
  ],
  dashboard: [
    ['total_students', 'total_placed', 'placement_rate', 'average_package', 'top_recruiter', 'active_drives', 'total_companies'],
    ['Total Students', 'Total Placed', 'Placement Rate (%)', 'Average Package (LPA)', 'Top Recruiter', 'Active Drives', 'Total Companies Visited'],
  ],
};

const exportAnalytics = async (collegeId, format, reportType = 'dashboard') => {
  const type = reportColumns[reportType?.toLowerCase()] ? reportType.toLowerCase() : 'dashboard';
  const data = await model.exportAnalyticsReport(collegeId, type);
  const [headers, labels] = reportColumns[type];
  const isExcel = format.toLowerCase() === 'excel';
  return {
    content: isExcel
      ? convertToCSV(data, headers, labels)
      : convertToHTMLReport(data, `${type[0].toUpperCase()}${type.slice(1)} Analytics Report`, headers, labels),
    contentType: isExcel ? 'text/csv' : 'text/html',
    filename: `${type}_report_${Date.now()}.${isExcel ? 'csv' : 'html'}`,
  };
};

export {
  listReports,
  generateReport,
  getReportById,
  deleteReport,
  previewReport,
  downloadReport,
  getMonthlyReport,
  getYearlyReport,
  exportAnalytics,
};
export default {
  listReports,
  generateReport,
  getReportById,
  deleteReport,
  previewReport,
  downloadReport,
  getMonthlyReport,
  getYearlyReport,
  exportAnalytics,
};
