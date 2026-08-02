import { pool } from "../config/db.js";
import { emailQueue } from "../queue/email.queue.js";

export const getNotifications = async ({ userId, page = 1, limit = 20 }) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;
  const offset = (page - 1) * limit;

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM notifications WHERE user_id = $1`,
    [userId],
  );
  const total = countResult.rows[0].total;

  const dataResult = await pool.query(
    `SELECT id, title, message, type, link_url, is_read, created_at
     FROM notifications
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset],
  );

  const unreadResult = await pool.query(
    `SELECT COUNT(*)::int AS count FROM notifications WHERE user_id = $1 AND is_read = false`,
    [userId],
  );

  const notifications = dataResult.rows.map((row) => ({
    id: row.id,
    title: row.title,
    message: row.message,
    type: row.type,
    linkUrl: row.link_url,
    isRead: row.is_read,
    createdAt: row.created_at,
  }));

  return {
    notifications,
    unreadCount: unreadResult.rows[0].count,
    page,
    limit,
    total,
  };
};

export const markAsRead = async ({ userId, notificationIds, markAll }) => {
  if (markAll) {
    const result = await pool.query(
      `UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false`,
      [userId],
    );
    return { updatedCount: result.rowCount };
  }

  if (notificationIds && notificationIds.length > 0) {
    const result = await pool.query(
      `UPDATE notifications SET is_read = true WHERE id = ANY($1::int[]) AND user_id = $2`,
      [notificationIds, userId],
    );
    return { updatedCount: result.rowCount };
  }

  return { updatedCount: 0 };
};

export const sendNotification = async ({
  userIds,
  title,
  message,
  type,
  linkUrl,
  sendEmail,
  role,
}) => {
  if (role) {
    const { rows } = await pool.query("SELECT id FROM users WHERE role = $1", [
      role,
    ]);
    userIds = rows.map((r) => r.id);
  }

  if (!userIds || userIds.length === 0) {
    return { success: true, message: "No users to notify" };
  }

  const placeholders = [];
  const values = [];
  let paramIndex = 1;

  for (const userId of userIds) {
    placeholders.push(
      `($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3}, $${paramIndex + 4})`,
    );
    values.push(userId, title, message, type || "info", linkUrl || null);
    paramIndex += 5;
  }

  await pool.query(
    `INSERT INTO notifications (user_id, title, message, type, link_url) VALUES ${placeholders.join(", ")}`,
    values,
  );

  if (sendEmail) {
    for (const userId of userIds) {
      await emailQueue.add({ userId, title, message, type: type || "info" });
    }
  }

  return { success: true, message: "Notifications dispatched successfully" };
};

export const getNotificationsService = async (userId) => {
  try {
    const query = `
      SELECT
        id AS "notificationId",
        title,
        message,
        type,
        is_read AS "isRead",
        created_at AS "createdAt"
      FROM notifications
      WHERE student_auth_user_id = $1
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, [userId]);

    return {
      notifications: result.rows,
      pagination: {
        unreadCount: result.rows.filter((n) => !n.isRead).length,
      },
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const markNotificationReadService = async (notificationId, userId) => {
  try {
    const query = `
      UPDATE notifications
      SET is_read = true
      WHERE id = $1
      AND student_auth_user_id = $2
    `;

    await pool.query(query, [notificationId, userId]);

    return { success: true };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const markAllNotificationsReadService = async (userId) => {
  try {
    const query = `
      UPDATE notifications
      SET is_read = true
      WHERE student_auth_user_id = $1
    `;

    await pool.query(query, [userId]);

    return { success: true };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
