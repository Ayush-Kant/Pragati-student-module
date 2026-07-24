/**
 * Location: backend/models/collegeAnalytics.model.js
 */
import { pool } from "../config/db.js";

/**
 * Helper to parse package numeric values in SQL
 */
const SQL_AVG_PACKAGE = `COALESCE(AVG(NULLIF(regexp_replace(package, '[^0-9.]', '', 'g'), '')::numeric), 0)`;

/**
 * Gets dashboard analytics summary.
 */
export const getDashboardAnalytics = async (collegeId) => {
  const { rows } = await pool.query(
    "SELECT * FROM analytics_dashboard WHERE college_id = $1",
    [collegeId]
  );

  if (rows.length > 0) {
    return rows[0];
  }

  // Fallback: Compute dynamically from students table
  const statsRes = await pool.query(
    `SELECT 
      COUNT(*)::int as total_students,
      COUNT(*) FILTER (WHERE placement_status = 'Placed')::int as total_placed,
      ${SQL_AVG_PACKAGE}::numeric(8,2) as average_package,
      COUNT(DISTINCT placed_at)::int as total_companies
     FROM students 
     WHERE college_id = $1`,
    [collegeId]
  );

  const stats = statsRes.rows[0];
  const total = stats.total_students;
  const placed = stats.total_placed;
  const placementRate = total > 0 ? ((placed / total) * 100).toFixed(2) : "0.00";

  // Query top recruiter
  const recRes = await pool.query(
    `SELECT placed_at as top_recruiter, COUNT(*) as count 
     FROM students 
     WHERE college_id = $1 AND placement_status = 'Placed' AND placed_at IS NOT NULL 
     GROUP BY placed_at 
     ORDER BY count DESC, placed_at ASC 
     LIMIT 1`,
    [collegeId]
  );
  const topRecruiter = recRes.rows[0]?.top_recruiter || null;

  return {
    college_id: collegeId,
    total_students: total,
    total_placed: placed,
    placement_rate: parseFloat(placementRate),
    average_package: parseFloat(stats.average_package || 0),
    top_recruiter: topRecruiter,
    active_drives: 0,
    total_companies: stats.total_companies,
  };
};

/**
 * Gets overview statistics (total students, placed, rates, active drives, companies).
 */
export const getOverviewStatistics = async (collegeId) => {
  return getDashboardAnalytics(collegeId);
};

/**
 * Gets placement analytics.
 */
export const getPlacementAnalytics = async (collegeId) => {
  const { rows } = await pool.query(
    "SELECT * FROM placement_statistics WHERE college_id = $1 ORDER BY year ASC",
    [collegeId]
  );

  if (rows.length > 0) {
    return rows;
  }

  // Fallback: Compute dynamically from students batch years
  const batchRes = await pool.query(
    `SELECT 
      batch::int as year,
      COUNT(*)::int as total_students,
      COUNT(*) FILTER (WHERE placement_status = 'Placed')::int as total_placed,
      ${SQL_AVG_PACKAGE}::numeric(8,2) as average_package,
      COALESCE(MAX(NULLIF(regexp_replace(package, '[^0-9.]', '', 'g'), '')::numeric), 0)::numeric(8,2) as highest_package
     FROM students 
     WHERE college_id = $1 AND batch ~ '^[0-9]+$'
     GROUP BY batch 
     ORDER BY batch ASC`,
    [collegeId]
  );

  return batchRes.rows.map(r => ({
    ...r,
    placement_rate: r.total_students > 0 ? parseFloat(((r.total_placed / r.total_students) * 100).toFixed(2)) : 0.00
  }));
};

/**
 * Gets department-wise analytics.
 */
export const getDepartmentAnalytics = async (collegeId) => {
  const { rows } = await pool.query(
    `SELECT 
      ds.*,
      d.name as department_name,
      d.code as department_code
     FROM department_statistics ds
     JOIN departments d ON d.id = ds.department_id
     WHERE ds.college_id = $1
     ORDER BY d.name ASC`,
    [collegeId]
  );

  if (rows.length > 0) {
    return rows;
  }

  // Fallback: Compute dynamically from students grouped by department
  const deptRes = await pool.query(
    `SELECT 
      department as department_name,
      COUNT(*)::int as total_students,
      COUNT(*) FILTER (WHERE placement_status = 'Placed')::int as total_placed,
      ${SQL_AVG_PACKAGE}::numeric(8,2) as average_package
     FROM students 
     WHERE college_id = $1 AND department IS NOT NULL
     GROUP BY department
     ORDER BY total_students DESC`,
    [collegeId]
  );

  return deptRes.rows.map((r, index) => ({
    id: index + 1,
    department_name: r.department_name,
    department_code: r.department_name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 10),
    total_students: r.total_students,
    total_placed: r.total_placed,
    placement_rate: r.total_students > 0 ? parseFloat(((r.total_placed / r.total_students) * 100).toFixed(2)) : 0.00,
    average_package: parseFloat(r.average_package || 0),
  }));
};

/**
 * Gets company hiring statistics.
 */
export const getCompanyAnalytics = async (collegeId) => {
  const { rows } = await pool.query(
    "SELECT * FROM company_statistics WHERE college_id = $1 ORDER BY total_hired DESC",
    [collegeId]
  );

  if (rows.length > 0) {
    return rows;
  }

  // Fallback: Compute dynamically from students placed
  const companyRes = await pool.query(
    `SELECT 
      placed_at as company_name,
      COUNT(*)::int as total_hired,
      ${SQL_AVG_PACKAGE}::numeric(8,2) as average_package
     FROM students 
     WHERE college_id = $1 AND placement_status = 'Placed' AND placed_at IS NOT NULL AND placed_at <> ''
     GROUP BY placed_at
     ORDER BY total_hired DESC`,
    [collegeId]
  );

  return companyRes.rows.map((r, index) => ({
    id: index + 1,
    company_name: r.company_name,
    company_id: null,
    total_hired: r.total_hired,
    average_package: parseFloat(r.average_package || 0),
  }));
};

export default {
  getDashboardAnalytics,
  getOverviewStatistics,
  getPlacementAnalytics,
  getDepartmentAnalytics,
  getCompanyAnalytics,
};
