import { pool } from "../../config/db.js";

export const getCourseModules = async (courseId) => {
    const query = `
    SELECT *
    FROM course_modules
    WHERE course_id = $1
    ORDER BY id;
  `;

    const { rows } = await pool.query(query, [courseId]);

    return rows;
};

export const getModuleDetails = async (moduleId) => {
    const query = `
    SELECT *
    FROM course_modules
    WHERE id = $1;
  `;

    const { rows } = await pool.query(query, [moduleId]);

    return rows[0];
};