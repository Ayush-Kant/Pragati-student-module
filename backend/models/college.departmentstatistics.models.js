import { pool } from "../config/db.js";

/**
 * Location: backend/models/college.departmentstatistics.models.js
 *
 * Raw SQL access to the `department_statistics` table.
 */

export const getDepartmentStatistics = async (departmentId = null) => {
  if (departmentId) {
    const { rows } = await pool.query(
      `SELECT
          ds.*,
          d.name AS department_name,
          d.code AS department_code
       FROM department_statistics ds
       JOIN departments d
         ON d.id = ds.department_id
       WHERE ds.department_id = $1`,
      [departmentId]
    );

    return rows[0] || null;
  }

  const { rows } = await pool.query(
    `SELECT
        ds.*,
        d.name AS department_name,
        d.code AS department_code
     FROM department_statistics ds
     JOIN departments d
       ON d.id = ds.department_id
     ORDER BY d.name ASC`
  );

  return rows;
};

/**
 * Insert or update department statistics.
 */
export const updateDepartmentStatistics = async (
  departmentId,
  {
    totalCourses,
    totalStudents,
    totalFaculty,
    averageCredits,
  }
) => {
  const { rows } = await pool.query(
    `INSERT INTO department_statistics
      (
        department_id,
        total_courses,
        total_students,
        total_faculty,
        average_credits,
        updated_at
      )
     VALUES
      ($1, $2, $3, $4, $5, NOW())

     ON CONFLICT (department_id)
     DO UPDATE SET
       total_courses   = COALESCE(EXCLUDED.total_courses, department_statistics.total_courses),
       total_students  = COALESCE(EXCLUDED.total_students, department_statistics.total_students),
       total_faculty   = COALESCE(EXCLUDED.total_faculty, department_statistics.total_faculty),
       average_credits = COALESCE(EXCLUDED.average_credits, department_statistics.average_credits),
       updated_at      = NOW()

     RETURNING *`,
    [
      departmentId,
      totalCourses ?? 0,
      totalStudents ?? 0,
      totalFaculty ?? 0,
      averageCredits ?? 0,
    ]
  );

  return rows[0];
};

/**
 * Recompute statistics from the courses table.
 */
export const recomputeDepartmentStatistics = async (departmentId) => {
  const { rows: aggRows } = await pool.query(
    `SELECT
        COUNT(*)::int AS total_courses,
        COALESCE(AVG(credits), 0)::numeric(4,2) AS average_credits
     FROM courses
     WHERE department_id = $1
       AND is_active = TRUE`,
    [departmentId]
  );

  const { total_courses, average_credits } = aggRows[0];

  const { rows } = await pool.query(
    `INSERT INTO department_statistics
      (
        department_id,
        total_courses,
        total_students,
        total_faculty,
        average_credits,
        updated_at
      )
     VALUES
      ($1, $2, 0, 0, $3, NOW())

     ON CONFLICT (department_id)
     DO UPDATE SET
       total_courses = EXCLUDED.total_courses,
       average_credits = EXCLUDED.average_credits,
       updated_at = NOW()

     RETURNING *`,
    [departmentId, total_courses, average_credits]
  );

  return rows[0];
};

export default {
  getDepartmentStatistics,
  updateDepartmentStatistics,
  recomputeDepartmentStatistics,
};