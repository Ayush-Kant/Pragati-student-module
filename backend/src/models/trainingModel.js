import { pool } from "../../config/db.js";

export const getAllCourses = async (studentId) => {
  const query = `
    SELECT
      tc.id,
      tc.title,
      tc.category,
      tc.level,
      tc.duration,
      tc.description,
      tc.created_at,
      tc.updated_at,
      COUNT(DISTINCT cm.id)::INT AS module_count,
      COUNT(DISTINCT l.id)::INT AS lesson_count,
      COALESCE(scp.progress, 0)::INT AS progress_percent
    FROM training_courses tc
    LEFT JOIN course_modules cm ON cm.course_id = tc.id
    LEFT JOIN lessons l ON l.module_id = cm.id
    LEFT JOIN student_course_progress scp ON scp.course_id = tc.id AND scp.student_id = $1
    GROUP BY tc.id, scp.progress
    ORDER BY tc.id;
  `;

  const { rows } = await pool.query(query, [studentId]);
  return rows;
};

export const getCourseById = async (id, studentId) => {
  const query = `
    SELECT
      tc.id,
      tc.title,
      tc.category,
      tc.level,
      tc.duration,
      tc.description,
      tc.created_at,
      tc.updated_at,
      COUNT(DISTINCT cm.id)::INT AS module_count,
      COUNT(DISTINCT l.id)::INT AS lesson_count,
      COALESCE(scp.progress, 0)::INT AS progress_percent
    FROM training_courses tc
    LEFT JOIN course_modules cm ON cm.course_id = tc.id
    LEFT JOIN lessons l ON l.module_id = cm.id
    LEFT JOIN student_course_progress scp ON scp.course_id = tc.id AND scp.student_id = $2
    WHERE tc.id = $1
    GROUP BY tc.id, scp.progress;
  `;

  const { rows } = await pool.query(query, [id, studentId]);
  return rows.length > 0 ? rows[0] : null;
};