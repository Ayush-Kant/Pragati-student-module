import { pool } from "../../config/db.js";

export const getAllCourses = async () => {
    const query = `
    SELECT *
    FROM training_courses
    ORDER BY id;
  `;

    const { rows } = await pool.query(query);

    return rows;
};

export const getCourseById = async (id) => {
    const query = `
    SELECT *
    FROM training_courses
    WHERE id = $1;
  `;

    const { rows } = await pool.query(query, [id]);

    return rows[0];
};