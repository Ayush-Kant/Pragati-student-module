import { pool } from "../../config/db.js";

export const getLessons = async (moduleId) => {
    const query = `
    SELECT *
    FROM lessons
    WHERE module_id = $1
    ORDER BY id;
  `;

    const { rows } = await pool.query(query, [moduleId]);

    return rows;
};

export const getLessonById = async (lessonId) => {
    const query = `
    SELECT *
    FROM lessons
    WHERE id = $1;
  `;

    const { rows } = await pool.query(query, [lessonId]);

    return rows[0];
};

export const updateLessonProgress = async (
    lessonId,
    studentId,
    completed
) => {
    const query = `
    UPDATE lesson_progress
    SET completed = $3,
        completed_at = NOW()
    WHERE lesson_id = $1
      AND student_id = $2
    RETURNING *;
  `;

    const values = [lessonId, studentId, completed];

    const { rows } = await pool.query(query, values);

    return rows[0];
};