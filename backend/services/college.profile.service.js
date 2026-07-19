import { pool } from '../config/db.js';

export const getProfile = async (id) => { 
    const result = await pool.query(
        `SELECT
            *
        FROM colleges
        WHERE user_id = $1
        `,[id]
    );
    return result.rows[0];
};

export const updateProfile = async (id, data) => {
  // Sanitize empty strings to null for database inserts/updates
  const sanitizedData = {};
  for (const key in data) {
    sanitizedData[key] = data[key] === "" ? null : data[key];
  }

  const fields = Object.keys(sanitizedData);
  const values = Object.values(sanitizedData);

  const setClause = fields
    .map((field, index) => `${field} = $${index + 1}`)
    .join(", ");

    const query = `
    UPDATE colleges
    SET ${setClause}
    WHERE user_id = $${fields.length + 1}
    RETURNING *;
  `;
    const result = await pool.query(query, [...values, id]);
    return result.rows[0];
};

export const createProfile = async (data) => {
  // Sanitize empty strings to null for database inserts/updates
  const sanitizedData = {};
  for (const key in data) {
    sanitizedData[key] = data[key] === "" ? null : data[key];
  }

  const fields = Object.keys(sanitizedData);
  const values = Object.values(sanitizedData);

  const placeholders = values.map((_, index) => `$${index + 1}`);

  const query = `
    INSERT INTO colleges (${fields.join(", ")})
    VALUES (${placeholders.join(", ")})
    RETURNING *;
  `;
  const result = await pool.query(query, values);
  return result.rows[0];
};