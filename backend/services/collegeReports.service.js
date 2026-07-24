import * as model from '../models/collegeReports.model.js';
import { buildReportPayload, buildReportSummary } from '../utils/reportGenerator.js';
import { convertToCSV, convertToHTMLReport } from '../utils/exportHelper.js';

const listReports = async (filters = {}) => {
  const page = Number.parseInt(filters.page, 10) || 1; const limit = Number.parseInt(filters.limit, 10) || 20; const offset = (page - 1) * limit;
  const [reports, total] = await Promise.all([model.getReports({ ...filters, limit, offset }), model.countReports(filters)]);
  return { reports, page, limit, total };
};
const generateReport = async (payload = {}, userId = null) => { const report = await model.createReport(buildReportPayload({ ...payload, createdBy: userId, status: 'completed' })); await model.createHistoryEntry({ reportId: report.id }); return report; };
const getReportById = (id) => model.getReportById(id);
const deleteReport = (id) => model.deleteReport(id);
const previewReport = async (id) => { const report = await model.getReportById(id); return report ? { ...buildReportSummary(report), preview: true, content: report.content || {} } : null; };
const downloadReport = async (id) => { const report = await model.getReportById(id); return report ? { ...buildReportSummary(report), downloadUrl: `/api/reports/${id}/download`, format: report.format || 'json' } : null; };
const getMonthlyReport = async (collegeId, query = {}) => ({ success: true, data: await model.getMonthlyReport(collegeId, query) });
const getYearlyReport = async (collegeId, query = {}) => ({ success: true, data: await model.getYearlyReport(collegeId, query) });
const reportColumns = {
  placements: [['year', 'total_students', 'total_placed', 'placement_rate', 'average_package', 'highest_package'], ['Year', 'Total Students', 'Total Placed', 'Placement Rate (%)', 'Average Package (LPA)', 'Highest Package (LPA)']],
  companies: [['company_name', 'total_hired', 'average_package'], ['Company Name', 'Total Students Placed', 'Average Salary Package (LPA)']],
  departments: [['department_name', 'department_code', 'total_students', 'total_placed', 'placement_rate', 'average_package'], ['Department Name', 'Code', 'Total Students', 'Placed Students', 'Placement Rate (%)', 'Average Salary Package (LPA)']],
  students: [['enrollment_no', 'name', 'email', 'department', 'course', 'cgpa', 'placement_status', 'placed_at', 'package'], ['Enrollment Number', 'Student Name', 'Email ID', 'Department', 'Course', 'CGPA', 'Status', 'Placed At Company', 'Salary Package']],
  dashboard: [['total_students', 'total_placed', 'placement_rate', 'average_package', 'top_recruiter', 'active_drives', 'total_companies'], ['Total Students', 'Total Placed', 'Placement Rate (%)', 'Average Package (LPA)', 'Top Recruiter', 'Active Drives', 'Total Companies Visited']],
};
const exportAnalytics = async (collegeId, format, reportType = 'dashboard') => {
  const type = reportColumns[reportType?.toLowerCase()] ? reportType.toLowerCase() : 'dashboard'; const data = await model.exportAnalyticsReport(collegeId, type); const [headers, labels] = reportColumns[type]; const isExcel = format.toLowerCase() === 'excel';
  return { content: isExcel ? convertToCSV(data, headers, labels) : convertToHTMLReport(data, `${type[0].toUpperCase()}${type.slice(1)} Analytics Report`, headers, labels), contentType: isExcel ? 'text/csv' : 'text/html', filename: `${type}_report_${Date.now()}.${isExcel ? 'csv' : 'html'}` };
};
export { listReports, generateReport, getReportById, deleteReport, previewReport, downloadReport, getMonthlyReport, getYearlyReport, exportAnalytics };
export default { listReports, generateReport, getReportById, deleteReport, previewReport, downloadReport, getMonthlyReport, getYearlyReport, exportAnalytics };
