import { pool } from "../config/db.js";

const valuesFromUser = (user) =>
  [...new Set([user?.userId, user?.uid, user?.authUserId, user?.id].filter(Boolean).map(String))];

export const resolveStudentId = async (user) => {
  if (!user) {
    const error = new Error("Authentication required");
    error.statusCode = 401;
    throw error;
  }

  const values = valuesFromUser(user);

  for (const value of values) {
    if (!/^\d+$/.test(value)) continue;

    const directStudent = await pool.query(
      "SELECT id FROM students WHERE id = $1 LIMIT 1",
      [Number(value)],
    );

    if (directStudent.rows[0]) return directStudent.rows[0].id;
  }

  for (const value of values) {
    const authLinkedStudent = await pool.query(
      `SELECT s.id
       FROM auth_users au
       INNER JOIN users u ON u.email = au.email
       INNER JOIN students s ON LOWER(s.email) = LOWER(u.email)
       WHERE au.uuid_id::text = $1
       LIMIT 1`,
      [value],
    );

    if (authLinkedStudent.rows[0]) return authLinkedStudent.rows[0].id;
  }

  for (const value of values) {
    if (!/^\d+$/.test(value)) continue;

    const userLinkedStudent = await pool.query(
      `SELECT s.id
       FROM users u
       INNER JOIN students s ON LOWER(s.email) = LOWER(u.email)
       WHERE u.id = $1
       LIMIT 1`,
      [Number(value)],
    );

    if (userLinkedStudent.rows[0]) return userLinkedStudent.rows[0].id;
  }

  const error = new Error("Student account is not linked to a student profile");
  error.statusCode = 404;
  throw error;
};

export default resolveStudentId;
