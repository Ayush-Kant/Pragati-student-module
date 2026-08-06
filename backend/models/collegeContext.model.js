import { pool } from '../config/db.js';

/** Resolves the college profile owned by an internal users.id value. */
export const findCollegeIdByUserId = async (userId) => {
  const { rows } = await pool.query(
    'SELECT id FROM colleges WHERE user_id = $1 OR user_id = (SELECT id FROM users WHERE auth_user_id = $1 LIMIT 1)',
    [userId]
  );
  return rows[0]?.id ?? null;
};

/** Resolves the college profile by email when user-id linkage is inconsistent. */
export const findCollegeIdByEmail = async (email) => {
  if (!email) return null;

  const { rows } = await pool.query('SELECT id FROM colleges WHERE email = $1', [email]);
  return rows[0]?.id ?? null;
};

/** Resolves the default/primary college profile when user context is not explicitly linked. */
export const findSingleCollegeId = async () => {
  const { rows } = await pool.query('SELECT id FROM colleges ORDER BY id ASC LIMIT 1');
  return rows[0]?.id ?? null;
};
