import { pool } from '../config/db.js';

/** Resolves the college profile owned by an internal users.id value. */
export const findCollegeIdByUserId = async (userId) => {
  const { rows } = await pool.query('SELECT id FROM colleges WHERE user_id = $1', [userId]);
  return rows[0]?.id ?? null;
};
