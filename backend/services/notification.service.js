import { pool } from "../config/db.js";

// GET ALL NOTIFICATIONS
export const getNotificationsService = async (
  userId
) => {
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

    const result = await pool.query(query, [
      userId,
    ]);

    return {
      notifications: result.rows,
      pagination: {
        unreadCount: result.rows.filter(
          (n) => !n.isRead
        ).length,
      },
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// MARK SINGLE NOTIFICATION READ
export const markNotificationReadService =
  async (notificationId, userId) => {
    try {
      const query = `
      UPDATE notifications
      SET is_read = true
      WHERE id = $1
      AND student_auth_user_id = $2
    `;

      await pool.query(query, [
        notificationId,
        userId,
      ]);

      return {
        success: true,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

// MARK ALL READ
export const markAllNotificationsReadService =
  async (userId) => {
    try {
      const query = `
      UPDATE notifications
      SET is_read = true
      WHERE student_auth_user_id = $1
    `;

      await pool.query(query, [userId]);

      return {
        success: true,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };