import { pool } from "../config/db.js";

export const getActiveDrives = async (mentorId) => {
  try {
    const query = `
      SELECT COUNT(*) as count 
      FROM recruitment_drives 
      WHERE mentor_id = $1 AND status = 'active'
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
      FROM submissions s
      JOIN assessments a ON s.assessment_id = a.id
      JOIN courses c ON a.course_id = c.id
      WHERE c.mentor_id = $1 AND s.status = 'submitted'
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
      SELECT id as "sessionId", title, session_type as "sessionType", scheduled_at as "scheduledAt"
      FROM live_sessions 
      WHERE mentor_id = $1 AND scheduled_at > NOW() 
      ORDER BY scheduled_at ASC 
      LIMIT 3
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
      SELECT 
        sp.student_id as "studentId", 
        u.full_name as "name", 
        sp.readiness_score as "readinessScore"
      FROM student_progress sp
      JOIN users u ON sp.student_id = u.id
      WHERE sp.drive_id IN (
        SELECT id
        FROM recruitment_drives
        WHERE mentor_id = $1
      )
      ORDER BY sp.readiness_score DESC 
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
