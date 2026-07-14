import { pool } from "../config/db.js";

// GET ALL NOTIFICATIONS
export const getNotificationsService = async (
  userId
) => {
  try {
    // userId is auth_users.uuid_id from req.user.userId
    const query = `
      SELECT
        n.id AS "notificationId",
        n.title,
        n.message,
        n.type,
        n.is_read AS "isRead",
        n.created_at AS "createdAt"
      FROM notifications n
      INNER JOIN auth_users ON auth_users.id = n.student_auth_user_id
      WHERE auth_users.uuid_id = $1
      ORDER BY n.created_at DESC
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
      // userId is auth_users.uuid_id from req.user.userId
      const query = `
      UPDATE notifications
      SET is_read = true
      WHERE id = $1
        AND student_auth_user_id = (
          SELECT id FROM auth_users WHERE uuid_id = $2
        )
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
      // userId is auth_users.uuid_id from req.user.userId
      const query = `
      UPDATE notifications
      SET is_read = true
      WHERE student_auth_user_id = (
        SELECT id FROM auth_users WHERE uuid_id = $1
      )
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
