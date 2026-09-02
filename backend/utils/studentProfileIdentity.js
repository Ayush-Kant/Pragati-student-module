import { pool } from "../config/db.js";

const uniqueStrings = (values) =>
  [...new Set(values.filter((value) => value !== undefined && value !== null && value !== "").map(String))];

export const resolveStudentId = async (user) => {
  if (!user) {
    const error = new Error("Authentication required");
    error.statusCode = 401;
    throw error;
  }

  // auth.controller.js issues JWTs with:
  // - userId: auth_users.uuid_id
  // - authUserId: auth_users.id
  // - id / uid: users.id
  // Resolve through the canonical auth -> users -> students relationship.
  if (user.userId) {
    const byUuid = await pool.query(
      `SELECT s.id
       FROM auth_users au
       INNER JOIN users u ON u.auth_user_id = au.id
       INNER JOIN students s ON LOWER(s.email) = LOWER(u.email)
       WHERE au.uuid_id::text = $1
       LIMIT 1`,
      [String(user.userId)],
    );

    if (byUuid.rows[0]) return byUuid.rows[0].id;
  }

  const authUserIds = uniqueStrings([user.authUserId]);
  for (const authUserId of authUserIds) {
    if (!/^\d+$/.test(authUserId)) continue;

    const byAuthId = await pool.query(
      `SELECT s.id
       FROM auth_users au
       INNER JOIN users u ON u.auth_user_id = au.id
       INNER JOIN students s ON LOWER(s.email) = LOWER(u.email)
       WHERE au.id = $1
       LIMIT 1`,
      [Number(authUserId)],
    );

    if (byAuthId.rows[0]) return byAuthId.rows[0].id;
  }

  const userIds = uniqueStrings([user.id, user.uid]);
  for (const userId of userIds) {
    if (!/^\d+$/.test(userId)) continue;

    const byUserId = await pool.query(
      `SELECT s.id
       FROM users u
       INNER JOIN students s ON LOWER(s.email) = LOWER(u.email)
       WHERE u.id = $1
       LIMIT 1`,
      [Number(userId)],
    );

    if (byUserId.rows[0]) return byUserId.rows[0].id;
  }

  const error = new Error("Student account is not linked to a student profile");
  error.statusCode = 404;
  throw error;
};

export default resolveStudentId;
