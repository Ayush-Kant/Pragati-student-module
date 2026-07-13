import { pool } from "../../config/db.js";

export const getResources = async () => {
    const query = `
    SELECT *
    FROM learning_resources
    ORDER BY id;
  `;

    const { rows } = await pool.query(query);

    return rows;
};

export const downloadResource = async (resourceId) => {
    const query = `
    SELECT *
    FROM learning_resources
    WHERE id = $1;
  `;

    const { rows } = await pool.query(query, [resourceId]);

    return rows[0];
};