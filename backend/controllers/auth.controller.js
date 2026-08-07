import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

const ALLOWED_ROLES = ['student', 'mentor', 'admin', 'college', 'company'];

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await pool.query(
      `SELECT a.id AS auth_user_id, a.uuid_id, a.email, a.role, a.password_hash, u.id AS user_id
       FROM auth_users a
       LEFT JOIN users u ON u.auth_user_id = a.id
       WHERE a.email = $1`,
      [email]
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
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      token,
      userId: user.uuid_id,
      role: user.role,
      message: "Login successful",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password and role are required",
      });
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const existing = await pool.query(
      `SELECT id FROM auth_users WHERE email = $1`,
      [email]
    );

    if (existing.rows.length) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const uuid = randomUUID();
    const client = await pool.connect();
    let authUserId;
    let userId;
    let companyId = null;
    try {
      await client.query("BEGIN");
      const user = await client.query(
        `INSERT INTO auth_users (email, password_hash, role, uuid_id)
         VALUES ($1, $2, $3, $4)
         RETURNING id` ,
        [email, passwordHash, role, uuid]
      );
      authUserId = user.rows[0].id;
      const userResult = await client.query(
        `INSERT INTO users (auth_user_id, email, role, created_at, phone, username)
         VALUES ($1, $2, $3, NOW(), $4, $5)
         RETURNING id`,
        [authUserId, email, role, null, email.split('@')[0]]
      );
      userId = userResult.rows[0].id;

      if (role === 'company') {
        const companyResult = await client.query(
          `INSERT INTO companies (user_id, name, email)
           VALUES ($1, $2, $3)
           RETURNING id`,
          [userId, email.split('@')[0] + ' Corporate', email]
        );
        companyId = companyResult.rows[0].id;
      }

      await client.query("COMMIT");
    }
    catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
    const token = jwt.sign(
      {
        id: userId,
        uid: userId,
        userId: uuid,
        authUserId: authUserId,
        email,
        role,
        companyId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      userId: uuid,
      token,
      message: "User registered successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

export const promoteAdmin = async (req, res) => {
  try {
    const secretHeader = req.headers['x-admin-secret'] || req.body?.secret;

    if (!process.env.ADMIN_PROMOTE_SECRET) {
      return res.status(500).json({ success: false, message: 'Server misconfigured: ADMIN_PROMOTE_SECRET not set' });
    }

    if (!secretHeader || secretHeader !== process.env.ADMIN_PROMOTE_SECRET) {
      return res.status(403).json({ success: false, message: 'Forbidden: invalid admin secret' });
    }

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const existing = await pool.query(`SELECT id FROM auth_users WHERE email = $1`, [email]);
    if (!existing.rows.length) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await pool.query(`UPDATE auth_users SET role = $1 WHERE email = $2`, ['admin', email]);
    await pool.query(`UPDATE users SET role = $1 WHERE email = $2`, ['admin', email]);

    return res.status(200).json({ success: true, message: 'User promoted to admin' });
  } catch (error) {
    console.error('promoteAdmin error', error);
    return res.status(500).json({ success: false, message: 'Promotion failed' });
  }
};
// reload backend server
