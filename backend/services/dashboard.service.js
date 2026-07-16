import { pool } from "../config/db.js";

export const getActiveDrives = async (mentorId) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) as count
       FROM recruitment_drives
       WHERE mentor_id = $1 AND status = 'active'`,
      [mentorId]
    );
    return parseInt(result.rows[0]?.count || 0, 10);
  } catch (error) {
    console.error("Error in getActiveDrives:", error);
    return 0;
  }
};

export const getPendingReviews = async (mentorId) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) as count
       FROM submissions s
       JOIN assessments a ON s.assessment_id = a.id
       JOIN courses c ON a.course_id = c.id
       WHERE c.mentor_id = $1 AND s.status = 'submitted'`,
      [mentorId]
    );
    return parseInt(result.rows[0]?.count || 0, 10);
  } catch (error) {
    console.error("Error in getPendingReviews:", error);
    return 0;
  }
};

export const getUpcomingSessions = async (mentorId) => {
  try {
    const result = await pool.query(
      `SELECT
         id            AS "sessionId",
         title,
         session_type  AS "sessionType",
         scheduled_at  AS "scheduledAt"
       FROM live_sessions
       WHERE mentor_id = $1
         AND scheduled_at > NOW()
       ORDER BY scheduled_at ASC
       LIMIT 3`,
      [mentorId]
    );
    return result.rows.length ? result.rows : [];
  } catch (error) {
    console.error("Error in getUpcomingSessions:", error);
    return [];
  }
};

export const getTopStudents = async (mentorId) => {
  try {
    const result = await pool.query(
      `SELECT
         sp.student_id       AS "studentId",
         u.full_name         AS "name",
         sp.readiness_score  AS "readinessScore"
       FROM student_progress sp
       JOIN users u ON sp.student_id = u.id
       WHERE sp.drive_id IN (
         SELECT id FROM recruitment_drives WHERE mentor_id = $1
       )
       ORDER BY sp.readiness_score DESC
       LIMIT 5`,
      [mentorId]
    );
    return result.rows.length ? result.rows : [];
  } catch (error) {
    console.error("Error in getTopStudents:", error);
    return [];
  }
};

export const getRecentNotifications = async (mentorId) => {
  try {
    const result = await pool.query(
      `SELECT type, message
       FROM notifications
       WHERE mentor_id = $1
       ORDER BY created_at DESC
       LIMIT 10`,
      [mentorId]
    );
    return result.rows.length ? result.rows : [];
  } catch (error) {
    console.error("Error in getRecentNotifications:", error);
    return [];
  }
};
