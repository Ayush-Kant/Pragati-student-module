import { pool } from "../../config/db.js";

export const getCourseProgress = async (studentId) => {
    const query = `
    SELECT *
    FROM student_course_progress
    WHERE student_id = $1;
  `;

    const { rows } = await pool.query(query, [studentId]);

    return rows;
};

export const updateCourseProgress = async (
    studentId,
    courseId,
    progress
) => {
    const query = `
    UPDATE student_course_progress
    SET progress = $3,
        updated_at = NOW()
    WHERE student_id = $1
      AND course_id = $2
    RETURNING *;
  `;

    const values = [studentId, courseId, progress];

    const { rows } = await pool.query(query, values);

    return rows[0];
};

export const getLearningStatistics = async (studentId) => {
    const query = `
    SELECT
      completed_lessons,
      total_lessons,
      progress
    FROM student_course_progress
    WHERE student_id = $1;
  `;

    const { rows } = await pool.query(query, [studentId]);

    return rows[0];
};