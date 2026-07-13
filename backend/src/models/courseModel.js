import { pool } from "../../config/db.js";

export const getCourseModules = async (courseId) => {
  const query = `
    SELECT
      cm.id,
      cm.course_id,
      cm.title,
      cm.description,
      cm.module_order,
      cm.created_at,
      cm.updated_at,
      COUNT(l.id)::INT AS lesson_count
    FROM course_modules cm
    LEFT JOIN lessons l ON l.module_id = cm.id
    WHERE cm.course_id = $1
    GROUP BY cm.id
    ORDER BY cm.module_order, cm.id;
  `;

  const { rows } = await pool.query(query, [courseId]);
  return rows;
};

export const getModuleDetails = async (moduleId) => {
  const query = `
    SELECT
      cm.id,
      cm.course_id,
      cm.title,
      cm.description,
      cm.module_order,
      cm.created_at,
      cm.updated_at,
      tc.title AS course_title,
      COUNT(l.id)::INT AS lesson_count
    FROM course_modules cm
    JOIN training_courses tc ON tc.id = cm.course_id
    LEFT JOIN lessons l ON l.module_id = cm.id
    WHERE cm.id = $1
    GROUP BY cm.id, tc.title;
  `;

  const { rows } = await pool.query(query, [moduleId]);
  return rows[0] || null;
};