import crypto from "node:crypto";
import bcrypt from "bcrypt";
import { pool } from "../config/db.js";
import { verifyFirebaseIdToken } from "./firebaseAdmin.service.js";

export const provisionStudentFromGoogle = async ({ idToken, collegeId }) => {
  const decoded = await verifyFirebaseIdToken(idToken);
  if (!decoded.email) {
    const error = new Error("Google account did not provide an email address");
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = decoded.email.trim().toLowerCase();
  const existing = await pool.query(
    `SELECT s.id AS student_id
     FROM students s
     WHERE s.firebase_uid = $1 OR LOWER(s.email) = LOWER($2)
     LIMIT 1`,
    [decoded.uid, normalizedEmail],
  );

  if (existing.rows.length) return null;

  const parsedCollegeId = Number(collegeId);
  if (!Number.isInteger(parsedCollegeId) || parsedCollegeId <= 0) {
    const error = new Error("College ID is required the first time you sign in with Google");
    error.statusCode = 400;
    throw error;
  }

  const college = await pool.query("SELECT id FROM colleges WHERE id = $1", [parsedCollegeId]);
  if (!college.rows.length) {
    const error = new Error("Selected college was not found");
    error.statusCode = 400;
    throw error;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const uuid = crypto.randomUUID();
    // Password is intentionally unusable for Google-provisioned accounts. Firebase remains
    // the authentication authority for these accounts.
    const passwordHash = await bcrypt.hash(`${crypto.randomUUID()}-${crypto.randomBytes(16).toString("hex")}`, 12);

    const authResult = await client.query(
      `INSERT INTO auth_users (email, password_hash, role, uuid_id)
       VALUES ($1, $2, 'student', $3)
       RETURNING id, uuid_id`,
      [normalizedEmail, passwordHash, uuid],
    );

    const userResult = await client.query(
      `INSERT INTO users (auth_user_id, email, role, created_at, phone, username)
       VALUES ($1, $2, 'student', NOW(), NULL, $3)
       RETURNING id`,
      [authResult.rows[0].id, normalizedEmail, normalizedEmail.split("@")[0]],
    );

    const name = (decoded.name || normalizedEmail.split("@")[0]).trim().slice(0, 80);
    const studentResult = await client.query(
      `INSERT INTO students (user_id, college_id, name, email, status, firebase_uid, onboarding_step)
       VALUES ($1, $2, $3, $4, 'pending', $5, 1)
       RETURNING id`,
      [userResult.rows[0].id, parsedCollegeId, name, normalizedEmail, decoded.uid],
    );

    await client.query(
      `INSERT INTO student_profiles (student_id) VALUES ($1)
       ON CONFLICT (student_id) DO NOTHING`,
      [studentResult.rows[0].id],
    );

    await client.query("COMMIT");
    return { studentId: studentResult.rows[0].id };
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.code === "23505") {
      const conflict = new Error("A student account already exists for this Google email");
      conflict.statusCode = 409;
      throw conflict;
    }
    throw error;
  } finally {
    client.release();
  }
};
