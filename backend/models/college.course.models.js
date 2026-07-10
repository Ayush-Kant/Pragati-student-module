import { pool } from "../config/db.js";

/**
 * Location: backend/models/college.course.models.js
 *
 * Raw SQL access to the `courses` table (joined with departments for
 * display fields). This is the only layer that talks directly to
 * PostgreSQL for courses.
 */

const BASE_SELECT = `
  SELECT
    c.id, c.course_name, c.course_code, c.semester, c.credits,
    c.department_id, d.name AS department_name, d.code AS department_code,
    c.description, c.is_active, c.created_at, c.updated_at
  FROM college_courses c
  JOIN departments d ON d.id = c.department_id
`;

export const getAllCourses = async ({ departmentId, semester, limit = 50, offset = 0 } = {}) => {
  const conditions = [];
  const params = [];
  let idx = 1;

  if (departmentId) {
    conditions.push(`c.department_id = $${idx}`);
    params.push(departmentId);
    idx += 1;
  }
  if (semester) {
    conditions.push(`c.semester = $${idx}`);
    params.push(semester);
    idx += 1;
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  params.push(limit, offset);

  const { rows } = await pool.query(
    `${BASE_SELECT} ${where} ORDER BY c.course_name ASC LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  return rows;
};

export const countCourses = async ({ departmentId, semester } = {}) => {
  const conditions = [];
  const params = [];
  let idx = 1;

  if (departmentId) {
    conditions.push(`department_id = $${idx}`);
    params.push(departmentId);
    idx += 1;
  }
  if (semester) {
    conditions.push(`semester = $${idx}`);
    params.push(semester);
    idx += 1;
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const { rows } = await pool.query(`SELECT COUNT(*)::int AS total FROM college_courses ${where}`, params);
  return rows[0].total;
};

export const getCourseById = async (id) => {
  const { rows } = await pool.query(`${BASE_SELECT} WHERE c.id = $1`, [id]);
  return rows[0] || null;
};

export const getCourseByCode = async (code) => {
  const { rows } = await pool.query(`${BASE_SELECT} WHERE c.course_code = $1`, [code]);
  return rows[0] || null;
};

export const createCourse = async ({ courseName, courseCode, semester, credits, departmentId, description }) => {
  const { rows } = await pool.query(
    `INSERT INTO college_courses (course_name, course_code, semester, credits, department_id, description)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, course_name, course_code, semester, credits, department_id, description, is_active, created_at, updated_at`,
    [courseName, courseCode, semester, credits, departmentId, description || null]
  );
  return rows[0];
};

export const updateCourse = async (id, fields) => {
  const map = {
    courseName: "course_name",
    courseCode: "course_code",
    semester: "semester",
    credits: "credits",
    departmentId: "department_id",
    description: "description",
    isActive: "is_active",
  };

  const setClauses = [];
  const params = [];
  let idx = 1;

  for (const [key, column] of Object.entries(map)) {
    if (Object.prototype.hasOwnProperty.call(fields, key)) {
      setClauses.push(`${column} = $${idx}`);
      params.push(fields[key]);
      idx += 1;
    }
  }

  if (setClauses.length === 0) return getCourseById(id);

  params.push(id);
  const { rows } = await pool.query(
    `UPDATE college_courses SET ${setClauses.join(", ")} WHERE id = $${idx}
     RETURNING id, course_name, course_code, semester, credits, department_id, description, is_active, created_at, updated_at`,
    params
  );
  return rows[0] || null;
};

export const deleteCourse = async (id) => {
  const { rows } = await pool.query(`DELETE FROM college_courses WHERE id = $1 RETURNING id`, [id]);
  return rows[0] || null;
};

export const getCoursesByDepartment = async (departmentId, { limit = 100, offset = 0 } = {}) => {
  const { rows } = await pool.query(
    `${BASE_SELECT} WHERE c.department_id = $1 ORDER BY c.semester ASC, c.course_name ASC LIMIT $2 OFFSET $3`,
    [departmentId, limit, offset]
  );
  return rows;
};

export default {
  getAllCourses,
  countCourses,
  getCourseById,
  getCourseByCode,
  createCourse,
  updateCourse,
  deleteCourse,
  getCoursesByDepartment,
};