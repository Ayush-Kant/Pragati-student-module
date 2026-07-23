import { pool } from '../config/db.js';

export const resolveUserIntId = async (uuid) => {
  if (!uuid) return null;
  // If it's already an integer (e.g. for mock tests or manual inserts), return it directly
  if (Number.isInteger(Number(uuid))) return Number(uuid);
  
  const result = await pool.query(
    `SELECT users.id
     FROM users
     JOIN auth_users ON auth_users.id = users.auth_user_id
     WHERE auth_users.uuid_id = $1`,
    [uuid]
  );
  return result.rows[0]?.id ?? null;
};
