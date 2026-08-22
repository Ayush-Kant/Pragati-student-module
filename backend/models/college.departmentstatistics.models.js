import { pool } from "../config/db.js";

/**
 * Location: backend/models/college.departmentstatistics.models.js
 */

// ======================================================
// Get Department Statistics
// ======================================================

export const getDepartmentStatistics = async (departmentId = null) => {
  if (departmentId) {
    const { rows } = await pool.query(
      `
      SELECT
        ds.*,
        d.name AS department_name,
        d.code AS department_code
      FROM department_statistics ds
      JOIN departments d
        ON d.id = ds.department_id
      WHERE ds.department_id = $1
      `,
      [departmentId]
    );

    return rows[0] || null;
  }

  const { rows } = await pool.query(
    `
    SELECT
      ds.*,
      d.name AS department_name,
      d.code AS department_code
    FROM department_statistics ds
    JOIN departments d
      ON d.id = ds.department_id
    ORDER BY d.name
    `
  );

  return rows;
};

// ======================================================
// Update Statistics
// ======================================================

export const updateDepartmentStatistics = async (
  departmentId,
  {
    totalCourses,
    totalStudents,
    totalFaculty,
    averageCredits,
  }
) => {

  const existing = await getDepartmentStatistics(departmentId);

  const finalTotalCourses =
    totalCourses ??
    existing?.total_courses ??
    0;

  const finalTotalStudents =
    totalStudents ??
    existing?.total_students ??
    0;

  const finalTotalFaculty =
    totalFaculty ??
    existing?.total_faculty ??
    0;

  const finalAverageCredits =
    averageCredits ??
    existing?.average_credits ??
    0;

  const { rows } = await pool.query(
    `
    INSERT INTO department_statistics
    (
      department_id,
      total_courses,
      total_students,
      total_faculty,
      average_credits,
      updated_at
    )
    VALUES
    (
      $1,
      $2,
      $3,
      $4,
      $5,
      NOW()
    )

    ON CONFLICT (department_id)
    DO UPDATE
    SET
      total_courses = EXCLUDED.total_courses,
      total_students = EXCLUDED.total_students,
      total_faculty = EXCLUDED.total_faculty,
      average_credits = EXCLUDED.average_credits,
      updated_at = NOW()

    RETURNING *;
    `,
    [
      departmentId,
      finalTotalCourses,
      finalTotalStudents,
      finalTotalFaculty,
      finalAverageCredits,
    ]
  );

  return rows[0];
};

// ======================================================
// Recompute Statistics
// ======================================================

export const recomputeDepartmentStatistics = async (departmentId) => {

  const { rows: aggregateRows } = await pool.query(
    `
    SELECT
      COUNT(*)::INT AS total_courses,
      COALESCE(AVG(credits),0)::NUMERIC(4,2) AS average_credits
    FROM college_courses
    WHERE department_id = $1
      AND is_active = TRUE
    `,
    [departmentId]
  );

  const totalCourses = Number(aggregateRows[0].total_courses);
  const averageCredits = Number(aggregateRows[0].average_credits);

  const existing = await getDepartmentStatistics(departmentId);

  const totalStudents =
    existing?.total_students ?? 0;

  const totalFaculty =
    existing?.total_faculty ?? 0;

  const { rows } = await pool.query(
    `
    INSERT INTO department_statistics
    (
      department_id,
      total_courses,
      total_students,
      total_faculty,
      average_credits,
      updated_at
    )
    VALUES
    (
      $1,
      $2,
      $3,
      $4,
      $5,
      NOW()
    )

    ON CONFLICT (department_id)
    DO UPDATE
    SET
      total_courses = EXCLUDED.total_courses,
      total_students = EXCLUDED.total_students,
      total_faculty = EXCLUDED.total_faculty,
      average_credits = EXCLUDED.average_credits,
      updated_at = NOW()

    RETURNING *;
    `,
    [
      departmentId,
      totalCourses,
      totalStudents,
      totalFaculty,
      averageCredits,
    ]
  );

  return rows[0];
};

export default {
  getDepartmentStatistics,
  updateDepartmentStatistics,
  recomputeDepartmentStatistics,
};