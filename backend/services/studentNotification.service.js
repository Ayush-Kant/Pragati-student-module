import { pool } from '../config/db.js';

const DEFAULT_PREFERENCES = {
  inApp: true,
  email: true,
  push: true,
  assignmentReminders: true,
  assessmentReminders: true,
  interviewUpdates: true,
  sessionReminders: true,
  weeklyDigest: true,
};

export const getNotifications = async (userId, page = 1, limit = 20, unreadOnly = false) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const offset = (safePage - 1) * safeLimit;
  const params = [userId];
  const unreadClause = unreadOnly ? ' AND is_read = false' : '';

  const count = await pool.query(
    `SELECT COUNT(*)::int AS total FROM notifications WHERE user_id = $1${unreadClause}`,
    params,
  );
  const unread = await pool.query(
    `SELECT COUNT(*)::int AS count FROM notifications WHERE user_id = $1 AND is_read = false`,
    [userId],
  );
  const rows = await pool.query(
    `SELECT id, title, message, type, link_url AS "linkUrl", is_read AS "isRead", created_at AS "createdAt"
     FROM notifications
     WHERE user_id = $1${unreadClause}
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, safeLimit, offset],
  );

  return {
    notifications: rows.rows,
    pagination: {
      currentPage: safePage,
      pageSize: safeLimit,
      totalCount: count.rows[0]?.total || 0,
      totalPages: Math.ceil((count.rows[0]?.total || 0) / safeLimit),
      unreadCount: unread.rows[0]?.count || 0,
    },
  };
};

export const markRead = async (userId, notificationId) => {
  const result = await pool.query(
    `UPDATE notifications SET is_read = true
     WHERE id = $1 AND user_id = $2
     RETURNING id, is_read AS "isRead"`,
    [notificationId, userId],
  );
  return result.rows[0] || null;
};

export const markAllRead = async (userId) => {
  const result = await pool.query(
    `UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false`,
    [userId],
  );
  return { updatedCount: result.rowCount };
};

export const getPreferences = async (userId) => {
  const studentResult = await pool.query('SELECT id FROM students WHERE user_id = $1 LIMIT 1', [userId]);
  const studentId = studentResult.rows[0]?.id;
  if (!studentId) return DEFAULT_PREFERENCES;

  const result = await pool.query(
    `SELECT in_app AS "inApp", email, push,
            assignment_reminders AS "assignmentReminders",
            assessment_reminders AS "assessmentReminders",
            interview_updates AS "interviewUpdates",
            session_reminders AS "sessionReminders",
            weekly_digest AS "weeklyDigest"
     FROM student_notification_preferences
     WHERE student_id = $1`,
    [studentId],
  );
  return { ...DEFAULT_PREFERENCES, ...(result.rows[0] || {}) };
};

export const savePreferences = async (userId, preferences) => {
  const studentResult = await pool.query('SELECT id FROM students WHERE user_id = $1 LIMIT 1', [userId]);
  const studentId = studentResult.rows[0]?.id;
  if (!studentId) {
    const error = new Error('Student profile not found');
    error.statusCode = 404;
    throw error;
  }

  const merged = { ...DEFAULT_PREFERENCES, ...preferences };
  const result = await pool.query(
    `INSERT INTO student_notification_preferences
      (student_id, in_app, email, push, assignment_reminders, assessment_reminders, interview_updates, session_reminders, weekly_digest)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT (student_id) DO UPDATE SET
       in_app = EXCLUDED.in_app,
       email = EXCLUDED.email,
       push = EXCLUDED.push,
       assignment_reminders = EXCLUDED.assignment_reminders,
       assessment_reminders = EXCLUDED.assessment_reminders,
       interview_updates = EXCLUDED.interview_updates,
       session_reminders = EXCLUDED.session_reminders,
       weekly_digest = EXCLUDED.weekly_digest,
       updated_at = NOW()
     RETURNING in_app AS "inApp", email, push,
       assignment_reminders AS "assignmentReminders",
       assessment_reminders AS "assessmentReminders",
       interview_updates AS "interviewUpdates",
       session_reminders AS "sessionReminders",
       weekly_digest AS "weeklyDigest"`,
    [studentId, merged.inApp, merged.email, merged.push, merged.assignmentReminders, merged.assessmentReminders, merged.interviewUpdates, merged.sessionReminders, merged.weeklyDigest],
  );
  return result.rows[0];
};

export default { getNotifications, markRead, markAllRead, getPreferences, savePreferences };
