import { pool } from "../config/db.js";

const uniqueStrings = (values) =>
  [...new Set(values.filter((value) => value !== undefined && value !== null && value !== "").map(String))];

export const resolveStudentId = async (user) => {
  if (!user) {
    const error = new Error("Authentication required");
    error.statusCode = 401;
    throw error;
  }

  // New student tokens carry the canonical students.id directly. Validate it
  // against the authenticated users row so the claim cannot select another
  // student's profile.
  if (/^\d+$/.test(String(user.studentId ?? ""))) {
    const byStudentClaim = await pool.query(
      `SELECT s.id
       FROM students s
       INNER JOIN users u ON u.id = s.user_id
       WHERE s.id = $1
         AND u.id = $2
       LIMIT 1`,
      [Number(user.studentId), Number(user.id)],
    );

    if (byStudentClaim.rows[0]) return byStudentClaim.rows[0].id;
  }

  // The canonical relationship is users.id = students.user_id. This is the
  // primary compatibility path for tokens created before studentId was added.
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

  // Legacy compatibility: old seeded/imported student rows may not have been
  // linked to users yet. Email is the final compatibility fallback.
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
