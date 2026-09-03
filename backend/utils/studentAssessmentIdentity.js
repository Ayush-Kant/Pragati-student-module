import { pool } from "../config/db.js";

const unique = (values) => [...new Set(values.filter((value) => value !== null && value !== undefined && value !== "").map(String))];
const isUuid = (value) => typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

export const resolveStudentId = async (user) => {
  if (!user) throw Object.assign(new Error("Authentication required"), { statusCode: 401 });

  if (/^\d+$/.test(String(user.studentId ?? "")) && /^\d+$/.test(String(user.id ?? ""))) {
    const result = await pool.query(
      `SELECT s.id
       FROM students s
       JOIN users u ON u.id = s.user_id
       WHERE s.id = $1 AND u.id = $2
       LIMIT 1`,
      [Number(user.studentId), Number(user.id)],
    );
    if (result.rows[0]) return result.rows[0].id;
  }

  for (const candidate of unique([user.id, user.uid])) {
    if (!/^\d+$/.test(candidate)) continue;
    const result = await pool.query(
      `SELECT s.id
       FROM students s
       JOIN users u ON u.id = s.user_id
       WHERE u.id = $1
       LIMIT 1`,
      [Number(candidate)],
    );
    if (result.rows[0]) return result.rows[0].id;
  }

  for (const candidate of unique([user.authUserId])) {
    if (!/^\d+$/.test(candidate)) continue;
    const result = await pool.query(
      `SELECT s.id
       FROM students s
       JOIN users u ON u.id = s.user_id
       JOIN auth_users au ON au.id = u.auth_user_id
       WHERE au.id = $1
       LIMIT 1`,
      [Number(candidate)],
    );
    if (result.rows[0]) return result.rows[0].id;
  }

  for (const candidate of unique([user.userId])) {
    if (!isUuid(candidate)) continue;
    const result = await pool.query(
      `SELECT s.id
       FROM students s
       JOIN users u ON u.id = s.user_id
       JOIN auth_users au ON au.id = u.auth_user_id
       WHERE au.uuid_id::text = $1
       LIMIT 1`,
      [candidate],
    );
    if (result.rows[0]) return result.rows[0].id;
  }

  if (user.email) {
    const result = await pool.query(`SELECT id FROM students WHERE LOWER(email) = LOWER($1) LIMIT 1`, [String(user.email)]);
    if (result.rows[0]) return result.rows[0].id;
  }

  throw Object.assign(new Error("Unable to resolve authenticated student"), { statusCode: 403 });
};

export default resolveStudentId;
