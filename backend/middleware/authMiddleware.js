import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { pool } from "../config/db.js";

dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Keep a lightweight activity timestamp for student notification digests.
    // Throttle writes so authenticated traffic does not update the database on every request.
    const authenticatedUserId = Number(decoded.id ?? decoded.uid);
    if (Number.isInteger(authenticatedUserId) && authenticatedUserId > 0) {
      try {
        await pool.query(
          `UPDATE users
           SET last_active_at = NOW()
           WHERE id = $1
             AND (last_active_at IS NULL OR last_active_at < NOW() - INTERVAL '15 minutes')`,
          [authenticatedUserId],
        );
      } catch (activityError) {
        console.warn("[auth] Failed to update activity timestamp:", activityError.message);
      }
    }

    if (decoded.role === "company") {
      const userId = decoded.id || decoded.uid;
      const result = await pool.query("SELECT id FROM companies WHERE user_id = $1", [userId]);
      if (result.rows.length > 0) {
        req.user.companyId = result.rows[0].id;
      }
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, error: "Token expired", message: "Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, error: "Invalid token", message: "Invalid token" });
    }
    return res.status(401).json({ success: false, error: "Invalid token", message: "Unauthorized" });
  }
};

export default authMiddleware;
