import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

const ALLOWED_ROLES = ["student", "mentor", "admin", "college", "company"];

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();
const normalizeRole = (role) => String(role || "").trim().toLowerCase();

export const login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = req.body?.password;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await pool.query(
      `SELECT
         a.id AS auth_user_id,
         a.uuid_id,
         a.email,
         a.role,
         a.password_hash,
         u.id AS user_id,
         s.id AS student_id
       FROM auth_users a
       LEFT JOIN users u ON u.auth_user_id = a.id
       LEFT JOIN students s ON s.user_id = u.id
       WHERE LOWER(a.email) = LOWER($1)`,
      [email],
    );

    if (!result.rows.length) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = result.rows[0];

    // Students must authenticate through Firebase. The shared frontend login page
    // uses this signal to switch to the canonical Firebase student flow while all
    // existing non-student platform roles keep their legacy authentication intact.
    if (user.role === "student") {
      return res.status(409).json({
        success: false,
        code: "STUDENT_USE_FIREBASE",
        message: "Student accounts must sign in with Firebase",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.user_id) {
      return res.status(409).json({
        success: false,
        message: "Account is not linked to a user profile",
      });
    }

    const token = jwt.sign(
      {
        id: user.user_id,
        uid: user.user_id,
        userId: user.uuid_id,
        authUserId: user.auth_user_id,
        email: user.email,
        role: user.role,
        studentId: user.student_id || null,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(200).json({
      success: true,
      token,
      userId: user.uuid_id,
      role: user.role,
      studentId: user.student_id || null,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed due to an internal server error",
    });
  }
};

export const register = async (req, res) => {
  let client;

  try {
    const normalizedEmail = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");
    const role = normalizeRole(req.body?.role);

    if (!normalizedEmail || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and role are required",
      });
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role selected",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    client = await pool.connect();
    await client.query("BEGIN");

    const existingAuth = await client.query(
      `SELECT id FROM auth_users WHERE LOWER(email) = LOWER($1) FOR UPDATE`,
      [normalizedEmail],
    );

    if (existingAuth.rows.length) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        success: false,
        message: "An account already exists for this email. Please log in instead.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const uuid = randomUUID();

    const authUserResult = await client.query(
      `INSERT INTO auth_users (email, password_hash, role, uuid_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, uuid_id`,
      [normalizedEmail, passwordHash, role, uuid],
    );
    const authUserId = authUserResult.rows[0].id;

    const userResult = await client.query(
      `INSERT INTO users (auth_user_id, email, role, created_at, phone, username)
       VALUES ($1, $2, $3, NOW(), NULL, $4)
       RETURNING id`,
      [authUserId, normalizedEmail, role, normalizedEmail.split("@")[0]],
    );
    const userId = userResult.rows[0].id;

    let studentId = null;
    let companyId = null;

    if (role === "student") {
      const existingStudent = await client.query(
        `SELECT id, user_id
         FROM students
         WHERE LOWER(email) = LOWER($1)
         LIMIT 1
         FOR UPDATE`,
        [normalizedEmail],
      );

      if (existingStudent.rows[0]) {
        if (existingStudent.rows[0].user_id && Number(existingStudent.rows[0].user_id) !== Number(userId)) {
          await client.query("ROLLBACK");
          return res.status(409).json({
            success: false,
            message: "A student profile with this email is already linked to another account.",
          });
        }

        const linked = await client.query(
          `UPDATE students
           SET user_id = $1,
               updated_at = COALESCE(updated_at, NOW())
           WHERE id = $2
           RETURNING id`,
          [userId, existingStudent.rows[0].id],
        );
        studentId = linked.rows[0].id;
      } else {
        const created = await client.query(
          `INSERT INTO students (user_id, name, email, status)
           VALUES ($1, $2, $3, 'pending')
           RETURNING id`,
          [userId, normalizedEmail.split("@")[0], normalizedEmail],
        );
        studentId = created.rows[0].id;
      }
    } else if (role === "mentor") {
      await client.query(`INSERT INTO mentors (user_id) VALUES ($1)`, [userId]);
    } else if (role === "company") {
      const companyResult = await client.query(
        `INSERT INTO companies (user_id, name, email)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [userId, `${normalizedEmail.split("@")[0]} Corporate`, normalizedEmail],
      );
      companyId = companyResult.rows[0].id;
    }

    await client.query("COMMIT");

    const token = jwt.sign(
      {
        id: userId,
        uid: userId,
        userId: uuid,
        authUserId,
        email: normalizedEmail,
        role,
        studentId,
        companyId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(201).json({
      success: true,
      userId: uuid,
      role,
      studentId,
      token,
      message: "User registered successfully",
    });
  } catch (error) {
    if (client) {
      try {
        await client.query("ROLLBACK");
      } catch {
        // The transaction may already have been rolled back or committed.
      }
    }

    console.error("Registration Error:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "An account or profile with this email already exists.",
      });
    }

    if (error.code === "23503") {
      return res.status(400).json({
        success: false,
        message: "Unable to link the account to its required profile.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed due to an internal server error",
    });
  } finally {
    client?.release();
  }
};
