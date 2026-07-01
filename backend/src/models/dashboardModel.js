import { pool } from "../../config/db.js";

export const getActiveDrive = async (mentorId) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) AS count
       FROM recruitment_drives
       WHERE mentor_id = $1
         AND status = 'active'`,
      [mentorId],
    );

    return Number.parseInt(result.rows[0]?.count || 0, 10);
  } catch (error) {
    console.error("Error in getActiveDrive:", error);
    return 0;
  }
};

export const getStudentProgress = async (studentId) => {
  try {
    const result = await pool.query(
      `SELECT
         sp.id AS "progressId",
         sp.drive_id AS "driveId",
         rd.title AS "driveTitle",
         sp.readiness_score AS "readinessScore",
         sp.completion_pct AS "completionPct",
         sp.created_at AS "createdAt"
       FROM student_progress sp
       JOIN recruitment_drives rd ON sp.drive_id = rd.id
       WHERE sp.student_id = $1
       ORDER BY sp.created_at DESC`,
      [studentId],
    );

    return result.rows;
  } catch (error) {
    console.error("Error in getStudentProgress:", error);
    return [];
  }
};

export const getUpcomingSessions = async (mentorId) => {
  try {
    const result = await pool.query(
      `SELECT
         id AS "sessionId",
         title,
         session_type AS "sessionType",
         scheduled_at AS "scheduledAt"
       FROM live_sessions
       WHERE mentor_id = $1
         AND scheduled_at > NOW()
       ORDER BY scheduled_at ASC
       LIMIT 5`,
      [mentorId],
    );

    return result.rows;
  } catch (error) {
    console.error("Error in getUpcomingSessions:", error);
    return [];
  }
};

export const getPendingTasks = async (mentorId) => {
  try {
    const result = await pool.query(
      `SELECT
         a.id AS "submissionId",
         a.activity_title AS "activityTitle",
         a.status,
         a.submitted_at AS "submittedAt",
         u.full_name AS "studentName",
         rd.title AS "driveTitle"
       FROM activity_submissions a
       JOIN users u ON a.student_id = u.id
       LEFT JOIN recruitment_drives rd ON a.drive_id = rd.id
       WHERE a.status = 'pending'
         AND a.drive_id IN (
           SELECT id FROM recruitment_drives WHERE mentor_id = $1
         )
       ORDER BY a.created_at ASC
       LIMIT 10`,
      [mentorId],
    );

    return result.rows;
  } catch (error) {
    console.error("Error in getPendingTasks:", error);
    return [];
  }
};

export const getNotifications = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT
         id AS "notificationId",
         title,
         message,
         type,
         is_read AS "isRead",
         created_at AS "createdAt"
       FROM notifications
       WHERE student_auth_user_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [userId],
    );

    return result.rows;
  } catch (error) {
    console.error("Error in getNotifications:", error);
    return [];
  }
};

export const getLeaderboard = async (mentorId) => {
  try {
    const result = await pool.query(
      `SELECT
         sp.student_id AS "studentId",
         u.full_name AS "name",
         MAX(sp.readiness_score) AS "readinessScore",
         MAX(sp.completion_pct) AS "completionPct",
         COUNT(DISTINCT sp.drive_id) AS "drivesTracked"
       FROM student_progress sp
       JOIN users u ON sp.student_id = u.id
       WHERE sp.drive_id IN (
         SELECT id FROM recruitment_drives WHERE mentor_id = $1
       )
       GROUP BY sp.student_id, u.full_name
       ORDER BY MAX(sp.readiness_score) DESC, MAX(sp.completion_pct) DESC
       LIMIT 10`,
      [mentorId],
    );

    return result.rows;
  } catch (error) {
    console.error("Error in getLeaderboard:", error);
    return [];
  }
};
