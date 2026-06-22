
import { pool } from '../config/db.js';

export const getProfile = async (id) => { 
    const result = await pool.query(
        `SELECT
            *
        FROM colleges
        WHERE id = $1
        `,[id]
    );
    return result.rows[0];
};

export const updateProfile = async (id, data) => {

  const fields = Object.keys(data);
  const values = Object.values(data);

  const setClause = fields
    .map((field, index) => `${field} = $${index + 1}`)
    .join(", ");

    const query = `
    UPDATE colleges
    SET ${setClause}
    WHERE id = $${fields.length + 1}
    RETURNING *;
  `;
    const result = await pool.query(query, [...values, id]);
    return result.rows[0];
};

export const createProfile = async (data) => {

  const fields = Object.keys(data);
  const values = Object.values(data);

  const placeholders = values.map((_, index) => `$${index + 1}`);

  const query = `
    INSERT INTO colleges (${fields.join(", ")})
    VALUES (${placeholders.join(", ")})
    RETURNING *;
  `;
  const result = await pool.query(query, values);
  return result.rows[0];
};