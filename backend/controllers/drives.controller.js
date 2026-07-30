import { pool } from "../config/db.js";

export const getActiveMentorDrives = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id AS "driveId", title AS "driveName"
       FROM recruitment_drives
       WHERE mentor_id = $1 AND status = 'active'
       ORDER BY created_at DESC`,
      [req.user.id],
    );

    return res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Get Active Mentor Drives Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
