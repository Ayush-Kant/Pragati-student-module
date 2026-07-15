import { pool } from "../config/db.js";

// Get all recipients for a notification
export const getRecipients = async (notificationId) => {
  const { rows } = await pool.query(
    `SELECT *
     FROM notification_recipients
     WHERE notification_id = $1
     ORDER BY created_at DESC`,
    [notificationId]
  );

  return rows;
};

// Add recipient
export const addRecipient = async ({
  notification_id,
  recipient_name,
  recipient_email,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO notification_recipients
      (notification_id, recipient_name, recipient_email)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [
      notification_id,
      recipient_name,
      recipient_email,
    ]
  );

  return rows[0];
};

// Remove recipient
export const removeRecipient = async (
  notificationId,
  recipientId
) => {
  const { rows } = await pool.query(
    `DELETE FROM notification_recipients
     WHERE notification_id = $1
       AND id = $2
     RETURNING *`,
    [
      notificationId,
      recipientId,
    ]
  );

  return rows[0];
};

// Get recipient status
export const getRecipientStatus = async (
  notificationId,
  recipientId
) => {
  const { rows } = await pool.query(
    `SELECT status
     FROM notification_recipients
     WHERE notification_id = $1
       AND id = $2`,
    [
      notificationId,
      recipientId,
    ]
  );

  return rows[0];
};

export default {
  getRecipients,
  addRecipient,
  removeRecipient,
  getRecipientStatus,
};