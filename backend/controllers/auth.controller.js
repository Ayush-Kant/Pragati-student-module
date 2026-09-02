import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

const ALLOWED_ROLES = ["student", "mentor", "admin", "college", "company"];

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Fetch user details spanning auth_users and users tables
    const result = await pool.query(
      `SELECT a.id AS auth_user_id, a.uuid_id, a.email, a.role, a.password_hash, u.id AS user_id
       FROM auth_users a
       LEFT JOIN users u ON u.auth_user_id = a.id
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

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Comprehensive JWT Payload matching the present ecosystem
    const token = jwt.sign(
      {
        id: user.user_id,
        uid: user.user_id,
        userId: user.uuid_id,
        authUserId: user.auth_user_id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(200).json({
      success: true,
      token,
      userId: user.uuid_id,
      role: user.role,
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
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
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

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await pool.query(
      `SELECT id FROM auth_users WHERE LOWER(email) = LOWER($1)`,
      [normalizedEmail],
    );

    if (existing.rows.length) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const uuid = randomUUID();

    // Initialize DB transaction variables
    const client = await pool.connect();
    let authUserId;
    let userId;
    let companyId = null;

    try {
      await client.query("BEGIN");

      // 1. Insert into auth_users
      const authUserResult = await client.query(
        `INSERT INTO auth_users (email, password_hash, role, uuid_id)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [normalizedEmail, passwordHash, role, uuid],
      );
      authUserId = authUserResult.rows[0].id;

      // 2. Insert into users
      const userResult = await client.query(
        `INSERT INTO users (auth_user_id, email, role, created_at, phone, username)
         VALUES ($1, $2, $3, NOW(), NULL, $4)
         RETURNING id`,
        [authUserId, normalizedEmail, role, normalizedEmail.split("@")[0]],
      );
      userId = userResult.rows[0].id;

      // 3. Create the canonical students row for student accounts.
      // The student profile module extends this row rather than creating a
      // second student identity system. Name is intentionally a placeholder
      // until the student fills their profile.
      if (role === "student") {
        await client.query(
          `INSERT INTO students (user_id, name, email, status)
           VALUES ($1, $2, $3, 'pending')
           ON CONFLICT (email) DO UPDATE
           SET user_id = EXCLUDED.user_id`,
          [userId, normalizedEmail.split("@")[0], normalizedEmail],
        );
      } else if (role === "mentor") {
        await client.query(`INSERT INTO mentors (user_id) VALUES ($1)`, [
          userId,
        ]);
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
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }

    // Generate Token
    const token = jwt.sign(
      {
        id: userId,
        uid: userId,
        userId: uuid,
        authUserId: authUserId,
        email: normalizedEmail,
        role,
        companyId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(201).json({
      success: true,
      userId: uuid,
      token,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed due to an internal server error",
    });
  }
};
