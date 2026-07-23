import { pool } from "../config/db.js";
import format from "pg-format";

export const getNotificationsService = async (userId, page = 1, limit = 20) => {
  const offset = (page - 1) * limit;

  // Run queries concurrently
  const [notificationsResult, countResult, unreadCountResult] = await Promise.all([
    pool.query(
      `SELECT id, title, message, type, link_url AS "linkUrl", is_read AS "isRead", created_at AS "createdAt"
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    ),
    pool.query(`SELECT COUNT(*) FROM notifications WHERE user_id = $1`, [userId]),
    pool.query(`SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false`, [userId]),
  ]);

  const notifications = notificationsResult.rows || [];
  const total = parseInt(countResult.rows[0].count, 10) || 0;
  const unreadCount = parseInt(unreadCountResult.rows[0].count, 10) || 0;

  return {
    notifications,
    unreadCount,
    total,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10)
  };
};

export const markNotificationsAsReadService = async (userId, notificationIds, markAll) => {
  if (markAll) {
    const result = await pool.query(
      `UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false`,
      [userId]
    );
    return result.rowCount;
  }

  if (notificationIds && notificationIds.length > 0) {
    const result = await pool.query(
      `UPDATE notifications SET is_read = true WHERE user_id = $1 AND id = ANY($2::int[]) AND is_read = false`,
      [userId, notificationIds]
    );
    return result.rowCount;
  }

  return 0;
};

export const createBulkNotificationsService = async (userIds, { title, message, type, linkUrl }) => {
  if (!userIds || userIds.length === 0) return;

  // Create an array of arrays for pg-format
  const values = userIds.map((userId) => [
    userId,
    title,
    message,
    type || 'info',
    linkUrl || null
  ]);

  const query = format(
    'INSERT INTO notifications (user_id, title, message, type, link_url) VALUES %L',
    values
  );

  await pool.query(query);
};
