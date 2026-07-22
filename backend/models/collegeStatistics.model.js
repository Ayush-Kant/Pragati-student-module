/**
 * Location: backend/models/collegeStatistics.model.js
 */
import { pool } from "../config/db.js";

const SQL_AVG_PACKAGE = `COALESCE(AVG(NULLIF(regexp_replace(package, '[^0-9.]', '', 'g'), '')::numeric), 0)`;
const SQL_VAL_PACKAGE = `NULLIF(regexp_replace(package, '[^0-9.]', '', 'g'), '')::numeric`;

/**
 * Gets placement statistics by year.
 */
export const getPlacementStatistics = async (collegeId) => {
  const { rows } = await pool.query(
    "SELECT * FROM placement_statistics WHERE college_id = $1 ORDER BY year ASC",
    [collegeId]
  );
  return rows;
};

/**
 * Gets hiring trends (placements per month).
 */
export const getHiringStatistics = async (collegeId) => {
  const { rows } = await pool.query(
    `SELECT report_month as month, total_placed as hired, average_package 
     FROM monthly_reports 
     WHERE college_id = $1 
     ORDER BY report_month ASC`,
    [collegeId]
  );

  if (rows.length > 0) {
    return rows;
  }

  // Fallback: Group students by creation month
  const dynamicRes = await pool.query(
    `SELECT 
      TO_CHAR(created_at, 'YYYY-MM') as month,
      COUNT(*) FILTER (WHERE placement_status = 'Placed')::int as hired,
      ${SQL_AVG_PACKAGE}::numeric(8,2) as average_package
     FROM students 
     WHERE college_id = $1 
     GROUP BY TO_CHAR(created_at, 'YYYY-MM'), DATE_TRUNC('month', created_at)
     ORDER BY DATE_TRUNC('month', created_at) ASC`,
    [collegeId]
  );

  return dynamicRes.rows;
};

/**
 * Gets package stats (min, max, average) for placed students.
 */
export const getPackageStatistics = async (collegeId) => {
  const { rows } = await pool.query(
    `SELECT 
      COALESCE(MAX(${SQL_VAL_PACKAGE}), 0)::numeric(8,2) as highest_package,
      COALESCE(MIN(${SQL_VAL_PACKAGE}), 0)::numeric(8,2) as lowest_package,
      COALESCE(AVG(${SQL_VAL_PACKAGE}), 0)::numeric(8,2) as average_package
     FROM students 
     WHERE college_id = $1 AND placement_status = 'Placed' AND package IS NOT NULL AND package <> ''`,
    [collegeId]
  );
  return rows[0];
};

/**
 * Gets students analytics: counts by placement status and CGPA distribution ranges.
 */
export const getStudentStatistics = async (collegeId) => {
  // Placement status count
  const statusRes = await pool.query(
    `SELECT 
      placement_status as status,
      COUNT(*)::int as count
     FROM students 
     WHERE college_id = $1
     GROUP BY placement_status`,
    [collegeId]
  );

  // CGPA ranges count
  const cgpaRes = await pool.query(
    `SELECT 
      COUNT(*) FILTER (WHERE cgpa >= 9.0)::int as range_9_10,
      COUNT(*) FILTER (WHERE cgpa >= 8.0 AND cgpa < 9.0)::int as range_8_9,
      COUNT(*) FILTER (WHERE cgpa >= 7.0 AND cgpa < 8.0)::int as range_7_8,
      COUNT(*) FILTER (WHERE cgpa < 7.0)::int as range_below_7
     FROM students 
     WHERE college_id = $1 AND cgpa IS NOT NULL`,
    [collegeId]
  );

  return {
    statusCounts: statusRes.rows,
    cgpaRanges: cgpaRes.rows[0],
  };
};

export default {
  getPlacementStatistics,
  getHiringStatistics,
  getPackageStatistics,
  getStudentStatistics,
};
