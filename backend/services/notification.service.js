import { pool } from "../config/db.js";
import { emailQueue, isEmailQueueAvailable } from "../queue/email.queue.js";

export const NOTIFICATION_TYPES = {
  GRADE_RELEASED: "grade_released",
  SESSION_SCHEDULED: "session_scheduled",
  ASSIGNMENT_PUBLISHED: "assignment_published",
  SHORTLISTED: "shortlisted",
  INTERVIEW_INVITED: "interview_invited",
  INTERVIEW_OUTCOME: "interview_outcome",
  PLATFORM_ANNOUNCEMENT: "platform_announcement",
  CERTIFICATE_ISSUED: "certificate_issued",
};

const DEFAULT_PREFERENCES = {
  [NOTIFICATION_TYPES.GRADE_RELEASED]: { inApp: true, email: true, push: false },
  [NOTIFICATION_TYPES.SESSION_SCHEDULED]: { inApp: true, email: true, push: true },
  [NOTIFICATION_TYPES.ASSIGNMENT_PUBLISHED]: { inApp: true, email: true, push: false },
  [NOTIFICATION_TYPES.SHORTLISTED]: { inApp: true, email: true, push: true },
  [NOTIFICATION_TYPES.INTERVIEW_INVITED]: { inApp: true, email: true, push: true },
  [NOTIFICATION_TYPES.INTERVIEW_OUTCOME]: { inApp: true, email: true, push: true },
  [NOTIFICATION_TYPES.PLATFORM_ANNOUNCEMENT]: { inApp: true, email: false, push: false },
  [NOTIFICATION_TYPES.CERTIFICATE_ISSUED]: { inApp: true, email: true, push: false },
};

const ALL_NOTIFICATION_TYPES = Object.keys(DEFAULT_PREFERENCES);

const assertNotificationType = (type) => {
  if (!DEFAULT_PREFERENCES[type]) {
    const error = new Error(`Unknown notification type: ${type}`);
    error.statusCode = 400;
    throw error;
  }
};

const normalizeUserId = (user) => {
  const userId = Number(user?.id ?? user?.uid ?? user);
  if (!Number.isInteger(userId) || userId <= 0) {
    const error = new Error("A valid user id is required");
    error.statusCode = 401;
    throw error;
  }
  return userId;
};

const normalizePage = (value, fallback) => Math.max(parseInt(value, 10) || fallback, 1);
const normalizeLimit = (value) => Math.min(Math.max(parseInt(value, 10) || 20, 1), 100);

const getStudentIdForUser = async (userId) => {
  const result = await pool.query(`SELECT id AS "studentId" FROM students WHERE user_id = $1 LIMIT 1`, [userId]);
  if (!result.rows[0]) {
    const error = new Error("Student profile not found");
    error.statusCode = 404;
    throw error;
  }
  return Number(result.rows[0].studentId);
};

const ensurePreferenceRows = async (studentId) => {
  for (const type of ALL_NOTIFICATION_TYPES) {
    const preference = DEFAULT_PREFERENCES[type];
    await pool.query(
      `INSERT INTO notification_preferences (student_id, notification_type, in_app, email, push)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (student_id, notification_type) DO NOTHING`,
      [studentId, type, preference.inApp, preference.email, preference.push],
    );
  }
};

export const getStudentPreferences = async (user) => {
  const userId = normalizeUserId(user);
  const studentId = await getStudentIdForUser(userId);
  await ensurePreferenceRows(studentId);
  const result = await pool.query(
    `SELECT notification_type AS "notificationType", in_app AS "inApp", email, push
     FROM notification_preferences WHERE student_id = $1 ORDER BY notification_type`,
    [studentId],
  );
  return Object.fromEntries(result.rows.map((row) => [row.notificationType, { inApp: row.inApp, email: row.email, push: row.push }]));
};

export const updateStudentPreferences = async (user, preferences) => {
  const userId = normalizeUserId(user);
  const studentId = await getStudentIdForUser(userId);
  if (!preferences || typeof preferences !== "object" || Array.isArray(preferences)) {
    const error = new Error("preferences must be an object");
    error.statusCode = 400;
    throw error;
  }
  for (const [type, channels] of Object.entries(preferences)) {
    assertNotificationType(type);
    if (!channels || typeof channels !== "object") {
      const error = new Error(`Invalid preference object for ${type}`);
      error.statusCode = 400;
      throw error;
    }
    const values = {
      inApp: channels.inApp !== undefined ? Boolean(channels.inApp) : DEFAULT_PREFERENCES[type].inApp,
      email: channels.email !== undefined ? Boolean(channels.email) : DEFAULT_PREFERENCES[type].email,
      push: channels.push !== undefined ? Boolean(channels.push) : DEFAULT_PREFERENCES[type].push,
    };
    await pool.query(
      `INSERT INTO notification_preferences (student_id, notification_type, in_app, email, push)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (student_id, notification_type)
       DO UPDATE SET in_app = EXCLUDED.in_app, email = EXCLUDED.email, push = EXCLUDED.push, updated_at = NOW()`,
      [studentId, type, values.inApp, values.email, values.push],
    );
  }
  return getStudentPreferences(user);
};

export const getNotifications = async ({ userId, read = "all", page = 1, limit = 20 }) => {
  const normalizedUserId = normalizeUserId(userId);
  const currentPage = normalizePage(page, 1);
  const pageSize = normalizeLimit(limit);
  const offset = (currentPage - 1) * pageSize;
  const readFilter = String(read).toLowerCase();
  if (!['true', 'false', 'all'].includes(readFilter)) {
    const error = new Error("read must be true, false, or all");
    error.statusCode = 400;
    throw error;
  }
  const readCondition = readFilter === 'all' ? '' : `AND n.is_read = ${readFilter === 'true' ? 'true' : 'false'}`;
  const [countResult, unreadResult, dataResult] = await Promise.all([
    pool.query(`SELECT COUNT(*)::int AS total FROM notifications n WHERE n.user_id = $1 ${readCondition}`, [normalizedUserId]),
    pool.query(`SELECT COUNT(*)::int AS count FROM notifications WHERE user_id = $1 AND is_read = false`, [normalizedUserId]),
    pool.query(
      `SELECT id, type, title, message AS body, message, link_url AS "linkUrl",
              is_read AS read, is_read AS "isRead", created_at AS "createdAt"
       FROM notifications n WHERE n.user_id = $1 ${readCondition}
       ORDER BY n.created_at DESC, n.id DESC LIMIT $2 OFFSET $3`,
      [normalizedUserId, pageSize, offset],
    ),
  ]);
  const total = Number(countResult.rows[0]?.total || 0);
  return {
    success: true,
    unreadCount: Number(unreadResult.rows[0]?.count || 0),
    notifications: dataResult.rows,
    pagination: { page: currentPage, limit: pageSize, total, totalPages: Math.ceil(total / pageSize) },
  };
};

export const markAsRead = async ({ userId, notificationIds, markAll = false }) => {
  const normalizedUserId = normalizeUserId(userId);
  if (markAll || notificationIds === 'all') {
    const result = await pool.query(`UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false`, [normalizedUserId]);
    return { success: true, updatedCount: result.rowCount };
  }
  if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
    const error = new Error("notificationIds must be an array or 'all'");
    error.statusCode = 400;
    throw error;
  }
  const ids = notificationIds.map((id) => Number(id));
  if (ids.some((id) => !Number.isInteger(id) || id <= 0)) {
    const error = new Error("notificationIds must contain valid notification ids");
    error.statusCode = 400;
    throw error;
  }
  const result = await pool.query(
    `UPDATE notifications SET is_read = true WHERE id = ANY($1::int[]) AND user_id = $2 AND is_read = false`,
    [ids, normalizedUserId],
  );
  return { success: true, updatedCount: result.rowCount };
};

const sendPushNotifications = async ({ subscriptions, payload }) => {
  if (!subscriptions.length || !process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY || !process.env.VAPID_SUBJECT) return { sent: 0, skipped: subscriptions.length };
  let webpush;
  try { webpush = (await import('web-push')).default; } catch { return { sent: 0, skipped: subscriptions.length }; }
  webpush.setVapidDetails(process.env.VAPID_SUBJECT, process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
  let sent = 0;
  for (const subscription of subscriptions) {
    try {
      await webpush.sendNotification(subscription, JSON.stringify(payload));
      sent += 1;
    } catch (error) {
      if (error?.statusCode === 404 || error?.statusCode === 410) await pool.query('DELETE FROM push_subscriptions WHERE endpoint = $1', [subscription.endpoint]);
      else console.error('[notifications] Push delivery failed:', error.message);
    }
  }
  return { sent, skipped: subscriptions.length - sent };
};

export const sendNotification = async ({ userIds, title, message, type = NOTIFICATION_TYPES.PLATFORM_ANNOUNCEMENT, linkUrl = null, role, sendEmail = true, sendPush = true }) => {
  assertNotificationType(type);
  let targetUserIds = Array.isArray(userIds) ? userIds.map(Number).filter((id) => Number.isInteger(id) && id > 0) : [];
  if (role) {
    const { rows } = await pool.query(`SELECT id FROM users WHERE role = $1`, [role]);
    targetUserIds = rows.map((row) => Number(row.id));
  }
  if (!targetUserIds.length) return { success: true, message: "No users to notify", delivered: 0 };

  const studentRows = await pool.query(
    `SELECT u.id AS "userId", s.id AS "studentId"
     FROM users u JOIN students s ON s.user_id = u.id
     WHERE u.id = ANY($1::int[])`,
    [targetUserIds],
  );
  const studentIds = studentRows.rows.map((row) => Number(row.studentId));
  const preferenceRows = studentIds.length
    ? await pool.query(`SELECT student_id, in_app, email, push FROM notification_preferences WHERE student_id = ANY($1::int[]) AND notification_type = $2`, [studentIds, type])
    : { rows: [] };
  const preferenceByStudent = new Map(preferenceRows.rows.map((row) => [Number(row.student_id), row]));
  let delivered = 0;
  const pushUsers = [];

  for (const targetUserId of targetUserIds) {
    const relation = studentRows.rows.find((row) => Number(row.userId) === targetUserId);
    const studentId = relation ? Number(relation.studentId) : null;
    const pref = preferenceByStudent.get(studentId) || DEFAULT_PREFERENCES[type];
    if (pref.in_app) {
      await pool.query(`INSERT INTO notifications (user_id, title, message, type, link_url, is_read) VALUES ($1, $2, $3, $4, $5, false)`, [targetUserId, title, message, type, linkUrl]);
      delivered += 1;
    }
    if (sendEmail && pref.email && isEmailQueueAvailable()) await emailQueue.add({ userId: targetUserId, title, message, type, linkUrl });
    if (sendPush && pref.push) pushUsers.push(targetUserId);
  }

  if (pushUsers.length) {
    const { rows: subscriptions } = await pool.query(`SELECT user_id AS "userId", endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = ANY($1::int[])`, [pushUsers]);
    const grouped = new Map();
    for (const row of subscriptions) {
      const userId = Number(row.userId);
      if (!grouped.has(userId)) grouped.set(userId, []);
      grouped.get(userId).push({ endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } });
    }
    for (const userId of pushUsers) await sendPushNotifications({ subscriptions: grouped.get(userId) || [], payload: { title, body: message, type, linkUrl } });
  }

  return { success: true, message: "Notifications dispatched successfully", delivered };
};

export const sendNotificationToStudents = async ({ studentIds, title, message, type, linkUrl = null, sendEmail = true, sendPush = true }) => {
  const ids = Array.isArray(studentIds) ? studentIds.map(Number).filter((id) => Number.isInteger(id) && id > 0) : [];
  if (!ids.length) return { success: true, message: 'No students to notify', delivered: 0 };
  const { rows } = await pool.query(`SELECT user_id AS "userId" FROM students WHERE id = ANY($1::int[]) AND user_id IS NOT NULL`, [ids]);
  return sendNotification({ userIds: rows.map((row) => Number(row.userId)), title, message, type, linkUrl, sendEmail, sendPush });
};

export const registerPushSubscription = async (user, subscription) => {
  const userId = normalizeUserId(user);
  const endpoint = String(subscription?.endpoint || '').trim();
  const p256dh = String(subscription?.keys?.p256dh || '').trim();
  const auth = String(subscription?.keys?.auth || '').trim();
  if (!/^https:\/\//i.test(endpoint) || !p256dh || !auth) {
    const error = new Error("Invalid push subscription object");
    error.statusCode = 400;
    throw error;
  }
  await pool.query(`INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth, user_agent) VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (endpoint) DO UPDATE SET user_id = EXCLUDED.user_id, p256dh = EXCLUDED.p256dh, auth = EXCLUDED.auth, user_agent = EXCLUDED.user_agent, updated_at = NOW()`, [userId, endpoint, p256dh, auth, null]);
  return { success: true, message: "Push notifications enabled" };
};

export const removePushSubscription = async (user, endpoint) => {
  const userId = normalizeUserId(user);
  const result = await pool.query(`DELETE FROM push_subscriptions WHERE user_id = $1 AND endpoint = $2`, [userId, endpoint]);
  return { success: true, deletedCount: result.rowCount };
};

export const getPublicPushKey = () => {
  if (!process.env.VAPID_PUBLIC_KEY) {
    const error = new Error('Browser push is not configured on this server');
    error.statusCode = 503;
    throw error;
  }
  return { publicKey: process.env.VAPID_PUBLIC_KEY };
};

export const sendDailyDigests = async () => {
  if (!isEmailQueueAvailable()) return { sent: 0 };

  const candidates = await pool.query(
    `SELECT u.id AS "userId"
     FROM users u
     JOIN students s ON s.user_id = u.id
     LEFT JOIN student_notification_preferences sp ON sp.student_id = s.id
     WHERE COALESCE(sp.weekly_digest, true) = true
       AND (u.last_active_at IS NULL OR u.last_active_at < NOW() - INTERVAL '24 hours')`,
  );

  let sent = 0;
  for (const row of candidates.rows) {
    const alreadySent = await pool.query(`SELECT 1 FROM notification_digest_log WHERE user_id = $1 AND digest_date = CURRENT_DATE LIMIT 1`, [row.userId]);
    if (alreadySent.rows.length) continue;
    const unread = await pool.query(`SELECT COUNT(*)::int AS count FROM notifications WHERE user_id = $1 AND is_read = false AND created_at < NOW() - INTERVAL '24 hours'`, [row.userId]);
    const count = Number(unread.rows[0]?.count || 0);
    if (!count) continue;
    await emailQueue.add({ userId: row.userId, title: 'Your Pragati notification digest', message: `You have ${count} unread notification${count === 1 ? '' : 's'} waiting in Pragati.`, type: 'digest' });
    await pool.query(`INSERT INTO notification_digest_log (user_id, digest_date) VALUES ($1, CURRENT_DATE) ON CONFLICT DO NOTHING`, [row.userId]);
    sent += 1;
  }
  return { sent };
};

export const startNotificationDigestScheduler = () => {
  const run = () => sendDailyDigests().catch((error) => console.error('[notifications] Daily digest failed:', error.message));
  const now = new Date();
  const next = new Date(now);
  next.setHours(9, 0, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  setTimeout(() => {
    run();
    setInterval(run, 24 * 60 * 60 * 1000);
  }, next.getTime() - now.getTime());
};

export default {
  getNotifications,
  markAsRead,
  sendNotification,
  sendNotificationToStudents,
  getStudentPreferences,
  updateStudentPreferences,
  registerPushSubscription,
  removePushSubscription,
  getPublicPushKey,
  sendDailyDigests,
  startNotificationDigestScheduler,
  NOTIFICATION_TYPES,
};
