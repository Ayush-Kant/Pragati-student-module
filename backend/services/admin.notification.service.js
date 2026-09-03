import { pool } from '../config/db.js';
import notificationService from './notification.service.js';

export const listNotifications = async ({ page, limit }) => {
  const offset = (page - 1) * limit;
  const notifications = await pool.query(
    `SELECT id, subject, recipient_group, channels, recipient_count, status, sent_at, created_at
     FROM admin_notifications ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  const total = await pool.query(`SELECT COUNT(*) FROM admin_notifications`);
  return {
    notifications: notifications.rows.map((n) => ({
      id: `notif_${n.id}`, subject: n.subject, to: { group: n.recipient_group }, channel: n.channels,
      recipientCount: n.recipient_count, status: n.status, sentAt: n.sent_at,
    })),
    total: parseInt(total.rows[0].count, 10), page, limit,
  };
};

export const sendNotification = async ({ to, channel, subject, message }) => {
  const group = to?.group || 'all';
  const specificUserId = to?.specificUserId || null;
  const channels = Array.isArray(channel) ? channel : String(channel || 'in-app').split(',').map((item) => item.trim().toLowerCase());

  let countRes;
  if (specificUserId) countRes = { rows: [{ count: '1' }] };
  else if (group === 'all') countRes = await pool.query(`SELECT COUNT(*) FROM users`);
  else countRes = await pool.query(`SELECT COUNT(*) FROM users WHERE role = $1`, [group]);
  const recipientCount = parseInt(countRes.rows[0].count, 10);

  const res = await pool.query(
    `INSERT INTO admin_notifications (recipient_group, specific_user_id, channels, subject, message, status, recipient_count, sent_at)
     VALUES ($1, $2, $3, $4, $5, 'sent', $6, NOW()) RETURNING id`,
    [group, specificUserId, channels, subject, message, recipientCount]
  );
  const notifId = res.rows[0].id;

  if (channels.includes('in-app')) {
    let users;
    if (specificUserId) users = await pool.query(`SELECT id FROM users WHERE id = $1`, [specificUserId]);
    else if (group === 'all') users = await pool.query(`SELECT id FROM users LIMIT 500`);
    else users = await pool.query(`SELECT id FROM users WHERE role = $1 LIMIT 500`, [group]);
    for (const user of users.rows) {
      await pool.query(
        `INSERT INTO notification_deliveries (notification_id, user_id, channel, delivery_status, delivered_at)
         VALUES ($1, $2, 'in-app', 'delivered', NOW())`,
        [notifId, user.id]
      );
    }
  }

  // Bridge administrator broadcasts into the student-facing notification centre.
  // The generic admin notification audit trail remains intact above.
  if (group === 'student' || group === 'students' || group === 'all' || specificUserId) {
    try {
      const payload = {
        title: subject,
        message,
        type: notificationService.NOTIFICATION_TYPES.PLATFORM_ANNOUNCEMENT,
        linkUrl: '/student/notifications',
        sendEmail: channels.includes('email'),
        sendPush: channels.includes('push'),
      };
      if (specificUserId) await notificationService.sendNotification({ userIds: [specificUserId], ...payload });
      else await notificationService.sendNotification({ role: group === 'all' ? 'student' : 'student', ...payload });
    } catch (error) {
      console.error('[admin.notification] Failed to bridge student announcement:', error.message);
    }
  }

  return {
    message: 'Notification sent successfully.',
    notification: { id: `notif_${notifId}`, status: 'sent', recipientCount },
  };
};

export const scheduleNotification = async ({ to, channel, subject, message, scheduledAt }) => {
  const group = to?.group || 'all';
  const specificUserId = to?.specificUserId || null;
  const res = await pool.query(
    `INSERT INTO admin_notifications (recipient_group, specific_user_id, channels, subject, message, status, scheduled_at)
     VALUES ($1, $2, $3, $4, $5, 'scheduled', $6) RETURNING id`,
    [group, specificUserId, channel, subject, message, scheduledAt]
  );
  return { message: 'Notification scheduled.', notification: { id: `notif_${res.rows[0].id}`, status: 'scheduled', scheduledAt } };
};

export const listTemplates = async () => {
  const res = await pool.query(`SELECT id, name, subject, body FROM notification_templates ORDER BY created_at DESC`);
  return res.rows;
};

export const createTemplate = async (payload) => {
  const { name, subject, body } = payload;
  const res = await pool.query(`INSERT INTO notification_templates (name, subject, body) VALUES ($1, $2, $3) RETURNING id`, [name, subject, body]);
  return { id: res.rows[0].id, name, subject, body };
};

export const getNotificationById = async (id) => {
  const realId = id.replace('notif_', '');
  const res = await pool.query(`SELECT id, recipient_group, channels, subject, message, status, sent_at, created_at FROM admin_notifications WHERE id = $1`, [realId]);
  if (res.rows.length === 0) return null;
  const n = res.rows[0];
  return { id: `notif_${n.id}`, to: { group: n.recipient_group }, channel: n.channels, subject: n.subject, message: n.message, status: n.status, sentAt: n.sent_at, createdAt: n.created_at };
};
