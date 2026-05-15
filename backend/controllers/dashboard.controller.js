import {
  getActiveDrives,
  getPendingReviews,
  getUpcomingSessions,
  getTopStudents,
  getRecentNotifications,
} from "../services/dashboard.service.js";
import { pool } from "../config/db.js";

export const getDashboard = async (req, res) => {
  try {
    // req.user comes from JWT payload
    const userId = req.user.id; // integer user ID from token

    // Find mentor record for this user
    const mentorResult = await pool.query(
      `SELECT id FROM mentors WHERE user_id = $1`,
      [userId]
    );

    if (!mentorResult.rows.length) {
      return res.status(403).json({ error: "User is not a mentor" });
    }

    const mentorId = mentorResult.rows[0].id;

    // Run all 5 queries in parallel
    const [
      activeDrives,
      pendingReviews,
      upcomingSessions,
      topStudents,
      recentNotifications,
    ] = await Promise.all([
      getActiveDrives(mentorId),
      getPendingReviews(mentorId),
      getUpcomingSessions(mentorId),
      getTopStudents(mentorId),
      getRecentNotifications(mentorId),
    ]);

    return res.status(200).json({
      activeDrives,
      pendingReviews,
      upcomingSessions,
      topStudents,
      recentNotifications,
    });

  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return res.status(500).json({ error: "Dashboard fetch failed" });
  }
};