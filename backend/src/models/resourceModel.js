import { pool } from "../../config/db.js";

export const getResources = async (lessonId) => {
  if (lessonId != null) {
    const lessonExists = await pool.query(
      `
        SELECT 1
        FROM lessons
        WHERE id = $1
      `,
      [lessonId]
    );

    if (lessonExists.rows.length === 0) {
      return null;
    }
  }

  const query = `
    SELECT
      id,
      lesson_id,
      title,
      resource_type,
      file_url,
      created_at
    FROM learning_resources
    WHERE ($1::INT IS NULL OR lesson_id = $1)
    ORDER BY id;
  `;

  const { rows } = await pool.query(query, [lessonId]);
  return rows;
};

export const getResourcesByCourse = async (courseId) => {
  const courseExists = await pool.query(
    `
      SELECT 1
      FROM training_courses
      WHERE id = $1
    `,
    [courseId]
  );

  if (courseExists.rows.length === 0) {
    return null;
  }

  const query = `
    SELECT
      lr.id,
      lr.lesson_id,
      l.title AS lesson_title,
      lr.title,
      lr.resource_type,
      lr.file_url,
      lr.created_at
    FROM learning_resources lr
    JOIN lessons l ON l.id = lr.lesson_id
    JOIN course_modules cm ON cm.id = l.module_id
    WHERE cm.course_id = $1
    ORDER BY lr.id;
  `;

  const { rows } = await pool.query(query, [courseId]);
  return rows;
};

export const downloadResource = async (resourceId) => {
  const query = `
    SELECT
      id,
      lesson_id,
      title,
      resource_type,
      file_url,
      created_at
    FROM learning_resources
    WHERE id = $1;
  `;

  const { rows } = await pool.query(query, [resourceId]);
  return rows.length > 0 ? rows[0] : null;
};