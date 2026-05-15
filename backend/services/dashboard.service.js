import { pool } from "../config/db.js";

export const getActiveDrives = async (mentorId) => {
  try {
    const query = `
      SELECT COUNT(*) as count 
      FROM recruitment_drives 
      WHERE mentor_id = $1
    `;
    const result = await pool.query(query, [mentorId]);
    return parseInt(result.rows[0]?.count || 0, 10);
  } catch (error) {
    console.error("Error in getActiveDrives:", error);
    return 0; // Return 0 fallback instead of throwing error
  }
};

export const getPendingReviews = async (mentorId) => {
  try {
    const query = `
      SELECT COUNT(*) as count 
      FROM submissions 
      WHERE mentor_id = $1 AND status = 'pending'
    `;
    const result = await pool.query(query, [mentorId]);
    return parseInt(result.rows[0]?.count || 0, 10);
  } catch (error) {
    console.error("Error in getPendingReviews:", error);
    return 0;
  }
};

export const getUpcomingSessions = async (mentorId) => {
  try {
    const query = `
      SELECT session_id as "sessionId", title, scheduled_at as "scheduledAt"
      FROM live_sessions 
      WHERE mentor_id = $1 AND scheduled_at > NOW() 
      ORDER BY scheduled_at ASC 
      LIMIT 5
    `;
    const result = await pool.query(query, [mentorId]);
    return result.rows.length ? result.rows : [];
  } catch (error) {
    console.error("Error in getUpcomingSessions:", error);
    return [];
  }
};

export const getTopStudents = async (mentorId) => {
  try {
    const query = `
      SELECT student_id as "studentId", name, readiness_score as "readinessScore"
      FROM student_progress 
      WHERE mentor_id = $1 
      ORDER BY readiness_score DESC 
      LIMIT 5
    `;
    const result = await pool.query(query, [mentorId]);
    return result.rows.length ? result.rows : [];
  } catch (error) {
    console.error("Error in getTopStudents:", error);
    return [];
  }
};

export const getRecentNotifications = async (mentorId) => {
  try {
    const query = `
      SELECT type, message 
      FROM notifications 
      WHERE mentor_id = $1 
      ORDER BY created_at DESC 
      LIMIT 10
    `;
    const result = await pool.query(query, [mentorId]);
    return result.rows.length ? result.rows : [];
  } catch (error) {
    console.error("Error in getRecentNotifications:", error);
    return [];
  }
};
