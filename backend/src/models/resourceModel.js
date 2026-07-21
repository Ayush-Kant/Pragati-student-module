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