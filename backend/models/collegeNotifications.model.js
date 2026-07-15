import { pool } from "../config/db.js";

// Get all notifications
export const getAllNotifications = async () => {
  const { rows } = await pool.query(
    `SELECT *
     FROM announcement_notifications
     ORDER BY created_at DESC`
  );

  return rows;
};

// Get notification by ID
export const getNotificationById = async (id) => {
  const { rows } = await pool.query(
    `SELECT *
     FROM announcement_notifications
     WHERE id = $1`,
    [id]
  );

  return rows[0];
};

// Create notification
export const createNotification = async ({
  announcement_id,
  title,
  message,
  audience,
  scheduled_at,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO announcement_notifications
      (announcement_id, title, message, audience, scheduled_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      announcement_id,
      title,
      message,
      audience,
      scheduled_at,
    ]
  );

  return rows[0];
};

// Update notification
export const updateNotification = async (id, data) => {
  const fields = [];
  const values = [];
  let index = 1;

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = $${index++}`);
      values.push(value);
    }
  });

  fields.push(`updated_at = CURRENT_TIMESTAMP`);

  values.push(id);

  const query = `
    UPDATE announcement_notifications
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *;
  `;

  const { rows } = await pool.query(query, values);

  return rows[0];
};

// Delete notification
export const deleteNotification = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM announcement_notifications
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return rows[0];
};

// Send notification
export const sendNotification = async (id) => {
  const { rows } = await pool.query(
    `UPDATE announcement_notifications
     SET status = 'Sent',
         sent_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return rows[0];
};

// Notification history
export const getNotificationHistory = async () => {
  const { rows } = await pool.query(
    `SELECT *
     FROM announcement_notifications
     ORDER BY sent_at DESC NULLS LAST`
  );

  return rows;
};

export default {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  sendNotification,
  getNotificationHistory,
};