import { pool } from '../config/db.js';

export const listNotifications = async ({ page, limit }) => {
  const offset = (page - 1) * limit;

  const notifications = await pool.query(
    `SELECT id, subject, recipient_group, channels, recipient_count, status, sent_at, created_at
     FROM admin_notifications
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  const total = await pool.query(`SELECT COUNT(*) FROM admin_notifications`);

  return {
    notifications: notifications.rows.map((n) => ({
      id: `notif_${n.id}`,
      subject: n.subject,
      to: { group: n.recipient_group },
      channel: n.channels,
      recipientCount: n.recipient_count,
      status: n.status,
      sentAt: n.sent_at,
    })),
    total: parseInt(total.rows[0].count, 10),
    page,
    limit,
  };
};

export const sendNotification = async ({ to, channel, subject, message }) => {
  const group = to?.group || 'all';
  const specificUserId = to?.specificUserId || null;

  // count recipients
  let countRes;
  if (specificUserId) {
    countRes = { rows: [{ count: '1' }] };
  } else if (group === 'all') {
    countRes = await pool.query(`SELECT COUNT(*) FROM users`);
  } else {
    countRes = await pool.query(`SELECT COUNT(*) FROM users WHERE role = $1`, [group]);
  }
  const recipientCount = parseInt(countRes.rows[0].count, 10);

  const res = await pool.query(
    `INSERT INTO admin_notifications (recipient_group, specific_user_id, channels, subject, message, status, recipient_count, sent_at)
     VALUES ($1, $2, $3, $4, $5, 'sent', $6, NOW())
     RETURNING id`,
    [group, specificUserId, channel, subject, message, recipientCount]
  );

  const notifId = res.rows[0].id;

  // save in-app delivery records
  if (channel.includes('in-app')) {
    let users;
    if (specificUserId) {
      users = await pool.query(`SELECT id FROM users WHERE id = $1`, [specificUserId]);
    } else if (group === 'all') {
      users = await pool.query(`SELECT id FROM users LIMIT 500`);
    } else {
      users = await pool.query(`SELECT id FROM users WHERE role = $1 LIMIT 500`, [group]);
    }

    for (const user of users.rows) {
      await pool.query(
        `INSERT INTO notification_deliveries (notification_id, user_id, channel, delivery_status, delivered_at)
         VALUES ($1, $2, 'in-app', 'delivered', NOW())`,
        [notifId, user.id]
      );
    }
  }

  return {
    message: 'Notification sent successfully.',
    notification: {
      id: `notif_${notifId}`,
      status: 'sent',
      recipientCount,
    },
  };
};

export const scheduleNotification = async ({ to, channel, subject, message, scheduledAt }) => {
  const group = to?.group || 'all';
  const specificUserId = to?.specificUserId || null;

  const res = await pool.query(
    `INSERT INTO admin_notifications (recipient_group, specific_user_id, channels, subject, message, status, scheduled_at)
     VALUES ($1, $2, $3, $4, $5, 'scheduled', $6)
     RETURNING id`,
    [group, specificUserId, channel, subject, message, scheduledAt]
  );

  const notifId = res.rows[0].id;

  return {
    message: 'Notification scheduled.',
    notification: {
      id: `notif_${notifId}`,
      status: 'scheduled',
      scheduledAt,
    },
  };
};

// junior's part below
export const listTemplates = async () => {};

export const createTemplate = async (payload) => {};

export const getNotificationById = async (id) => {};
