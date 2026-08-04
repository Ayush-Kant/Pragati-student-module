import { pool } from '../config/db.js';
import { getPlacementAnalytics, getCompanyAnalytics, getDepartmentAnalytics, getDashboardAnalytics } from './collegeAnalytics.model.js';

const getReports = async ({ limit = 20, offset = 0, type, status } = {}) => {
  const values = []; let query = 'SELECT id, title, type, status, format, content, created_at AS "createdAt", updated_at AS "updatedAt" FROM generated_reports WHERE 1=1';
  if (type) { values.push(type); query += ` AND type = $${values.length}`; }
  if (status) { values.push(status); query += ` AND status = $${values.length}`; }
  values.push(limit, offset); query += ` ORDER BY created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`;
  return (await pool.query(query, values)).rows;
};
const countReports = async ({ type, status } = {}) => {
  const values = []; let query = 'SELECT COUNT(*)::INTEGER AS total FROM generated_reports WHERE 1=1';
  if (type) { values.push(type); query += ` AND type = $${values.length}`; }
  if (status) { values.push(status); query += ` AND status = $${values.length}`; }
  return (await pool.query(query, values)).rows[0]?.total || 0;
};
const createReport = async (payload = {}) => (await pool.query(`INSERT INTO generated_reports (title, type, status, format, content, created_by, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING id, title, type, status, format, content, created_at AS "createdAt", updated_at AS "updatedAt"`, [payload.title || 'Generated Report', payload.type || 'dashboard', payload.status || 'completed', payload.format || 'json', payload.content ? JSON.stringify(payload.content) : '{}', payload.createdBy || null])).rows[0];
const createHistoryEntry = async ({ reportId, action = 'generated' } = {}) => (await pool.query(`INSERT INTO report_history (report_id, action, created_at) VALUES ($1, $2, NOW()) RETURNING id, report_id AS "reportId", action, created_at AS "createdAt"`, [reportId, action])).rows[0];
const getReportById = async (id) => (await pool.query('SELECT id, title, type, status, format, content, created_at AS "createdAt", updated_at AS "updatedAt" FROM generated_reports WHERE id = $1', [id])).rows[0] || null;
const deleteReport = async (id) => (await pool.query('DELETE FROM generated_reports WHERE id = $1 RETURNING id', [id])).rows[0] || null;

const getMonthlyReport = async (collegeId, { month } = {}) => {
  const result = month ? await pool.query('SELECT * FROM monthly_reports WHERE college_id = $1 AND report_month = $2', [collegeId, month]) : await pool.query('SELECT * FROM monthly_reports WHERE college_id = $1 ORDER BY report_month DESC LIMIT 1', [collegeId]);
  return result.rows[0] || null;
};
const getYearlyReport = async (collegeId, { year } = {}) => {
  const result = year ? await pool.query('SELECT * FROM yearly_reports WHERE college_id = $1 AND report_year = $2', [collegeId, Number.parseInt(year, 10)]) : await pool.query('SELECT * FROM yearly_reports WHERE college_id = $1 ORDER BY report_year DESC LIMIT 1', [collegeId]);
  return result.rows[0] || null;
};
const exportAnalyticsReport = async (collegeId, reportType = 'dashboard') => {
  switch (reportType.toLowerCase()) {
    case 'placements': return getPlacementAnalytics(collegeId);
    case 'companies': return getCompanyAnalytics(collegeId);
    case 'departments': return getDepartmentAnalytics(collegeId);
    case 'students': return (await pool.query('SELECT enrollment_no, name, email, department, course, cgpa, placement_status, placed_at, package FROM students WHERE college_id = $1 ORDER BY name ASC', [collegeId])).rows;
    default: return [await getDashboardAnalytics(collegeId)];
  }
};
export { getReports, countReports, createReport, createHistoryEntry, getReportById, deleteReport, getMonthlyReport, getYearlyReport, exportAnalyticsReport };
export default { getReports, countReports, createReport, createHistoryEntry, getReportById, deleteReport, getMonthlyReport, getYearlyReport, exportAnalyticsReport };
