import { pool } from "../config/db.js";

const isUuid = (value) =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const candidateIds = (user) => [user?.userId, user?.uid, user?.authUserId, user?.id]
  .filter((value) => value !== null && value !== undefined && value !== "")
  .map(String)
  .filter((value, index, values) => values.indexOf(value) === index);

export const resolveStudentId = async (user) => {
  for (const candidate of candidateIds(user)) {
    if (/^\d+$/.test(candidate)) {
      const direct = await pool.query(
        "SELECT id FROM students WHERE id = $1 LIMIT 1",
        [Number(candidate)],
      );
      if (direct.rows[0]) return direct.rows[0].id;

      const userResult = await pool.query(
        "SELECT email FROM users WHERE id = $1 LIMIT 1",
        [Number(candidate)],
      );
      const email = userResult.rows[0]?.email;
      if (email) {
        const studentResult = await pool.query(
          "SELECT id FROM students WHERE LOWER(email) = LOWER($1) LIMIT 1",
          [email],
        );
        if (studentResult.rows[0]) return studentResult.rows[0].id;
      }
    }

    if (isUuid(candidate)) {
      const result = await pool.query(
        `SELECT s.id
         FROM auth_users au
         JOIN users u ON u.auth_user_id = au.id
         JOIN students s ON LOWER(s.email) = LOWER(u.email)
         WHERE au.uuid_id = $1
         LIMIT 1`,
        [candidate],
      );
      if (result.rows[0]) return result.rows[0].id;
    }
  }

  throw Object.assign(new Error("Unable to resolve authenticated student"), {
    statusCode: 403,
  });
};

export default resolveStudentId;
