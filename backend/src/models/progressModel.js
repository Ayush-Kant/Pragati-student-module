import { pool } from "../../config/db.js";

export const getCourseProgress = async (studentId) => {
  const query = `
    SELECT
      scp.id,
      scp.student_id,
      scp.course_id,
      tc.title AS course_title,
      scp.completed_lessons,
      scp.total_lessons,
      scp.progress,
      scp.updated_at
    FROM student_course_progress scp
    JOIN training_courses tc ON tc.id = scp.course_id
    WHERE scp.student_id = $1
    ORDER BY scp.updated_at DESC;
  `;

  const { rows } = await pool.query(query, [studentId]);
  return rows;
};

export const updateCourseProgress = async (studentId, courseId, progress) => {
  const query = `
    INSERT INTO student_course_progress (student_id, course_id, progress, completed_lessons, total_lessons, created_at, updated_at)
    VALUES ($1, $2, $3, 0, 0, NOW(), NOW())
    ON CONFLICT (student_id, course_id)
    DO UPDATE SET progress = EXCLUDED.progress,
                  updated_at = NOW()
    RETURNING *;
  `;

  const { rows } = await pool.query(query, [studentId, courseId, progress]);
  return rows[0];
};

export const getLearningStatistics = async (studentId) => {
  const query = `
    SELECT
      COALESCE((SELECT COUNT(*) FROM lesson_progress WHERE student_id = $1 AND completed = TRUE), 0)::INT AS completed_lessons,
      COALESCE((SELECT COUNT(*) FROM lessons), 0)::INT AS total_lessons,
      COALESCE((SELECT AVG(progress) FROM student_course_progress WHERE student_id = $1), 0)::NUMERIC AS average_progress
  `;

  const { rows } = await pool.query(query, [studentId]);
  return rows[0] || null;
};