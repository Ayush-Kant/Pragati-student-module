/**
 * Location: backend/models/collegeReports.model.js
 */
import { pool } from "../config/db.js";
import { getPlacementAnalytics, getCompanyAnalytics, getDepartmentAnalytics, getDashboardAnalytics } from "./collegeAnalytics.model.js";

/**
 * Gets a monthly report by month or the latest one available.
 */
export const getMonthlyReport = async (collegeId, query = {}) => {
  const { month } = query;
  
  if (month) {
    const { rows } = await pool.query(
      "SELECT * FROM monthly_reports WHERE college_id = $1 AND report_month = $2",
      [collegeId, month]
    );
    return rows[0] || null;
  }

  const { rows } = await pool.query(
    "SELECT * FROM monthly_reports WHERE college_id = $1 ORDER BY report_month DESC LIMIT 1",
    [collegeId]
  );
  return rows[0] || null;
};

/**
 * Gets a yearly report by year or the latest one available.
 */
export const getYearlyReport = async (collegeId, query = {}) => {
  const { year } = query;

  if (year) {
    const { rows } = await pool.query(
      "SELECT * FROM yearly_reports WHERE college_id = $1 AND report_year = $2",
      [collegeId, parseInt(year, 10)]
    );
    return rows[0] || null;
  }

  const { rows } = await pool.query(
    "SELECT * FROM yearly_reports WHERE college_id = $1 ORDER BY report_year DESC LIMIT 1",
    [collegeId]
  );
  return rows[0] || null;
};

/**
 * Prepares the appropriate dataset for exporting based on the report type.
 */
export const exportAnalyticsReport = async (collegeId, reportType = "dashboard", query = {}) => {
  switch (reportType.toLowerCase()) {
    case "placements":
      return getPlacementAnalytics(collegeId);
    
    case "companies":
      return getCompanyAnalytics(collegeId);
    
    case "departments":
      return getDepartmentAnalytics(collegeId);
      
    case "students": {
      const { rows } = await pool.query(
        `SELECT enrollment_no, name, email, department, course, cgpa, placement_status, placed_at, package 
         FROM students 
         WHERE college_id = $1
         ORDER BY name ASC`,
        [collegeId]
      );
      return rows;
    }
    
    case "dashboard":
    default: {
      const overview = await getDashboardAnalytics(collegeId);
      return [overview];
    }
  }
};

export default {
  getMonthlyReport,
  getYearlyReport,
  exportAnalyticsReport,
};
