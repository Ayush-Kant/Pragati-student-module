import { pool } from "../config/db.js";

const uniqueStrings = (values) =>
  [...new Set(values.filter((value) => value !== undefined && value !== null && value !== "").map(String))];

export const resolveStudentId = async (user) => {
  if (!user) {
    const error = new Error("Authentication required");
    error.statusCode = 401;
    throw error;
  }

  // The canonical relationship is auth_users -> users -> students through
  // users.id = students.user_id. Email matching remains only as a legacy
  // fallback for older student rows that predate account linking.
  const userIds = uniqueStrings([user.id, user.uid]);
  for (const userId of userIds) {
    if (!/^\d+$/.test(userId)) continue;

    const byUserId = await pool.query(
      `SELECT s.id
       FROM users u
       INNER JOIN students s ON s.user_id = u.id
       WHERE u.id = $1
       LIMIT 1`,
      [Number(userId)],
    );

    if (byUserId.rows[0]) return byUserId.rows[0].id;
  }

  if (user.userId) {
    const byUuid = await pool.query(
      `SELECT s.id
       FROM auth_users au
       INNER JOIN users u ON u.auth_user_id = au.id
       INNER JOIN students s ON s.user_id = u.id
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
       INNER JOIN students s ON s.user_id = u.id
       WHERE au.id = $1
       LIMIT 1`,
      [Number(authUserId)],
    );

    if (byAuthId.rows[0]) return byAuthId.rows[0].id;
  }

  // Legacy compatibility: some old seeded student rows only have email.
  // This fallback allows those rows to be discovered until they are linked.
  if (user.email) {
    const byEmail = await pool.query(
      `SELECT s.id
       FROM students s
       WHERE LOWER(s.email) = LOWER($1)
       LIMIT 1`,
      [String(user.email)],
    );

    if (byEmail.rows[0]) return byEmail.rows[0].id;
  }

  const error = new Error("Student account is not linked to a student profile");
  error.statusCode = 404;
  throw error;
};

export default resolveStudentId;
