import * as recipientModel from "../models/collegeRecipients.model.js";

/**
 * Location:
 * backend/services/collegeRecipients.service.js
 */

const formatRecipient = (row) => ({
  id: row.id,
  notificationId: row.notification_id,
  recipientName: row.recipient_name,
  recipientEmail: row.recipient_email,
  status: row.status,
  createdAt: row.created_at,
});

export const getRecipients = async (notificationId) => {
  const rows = await recipientModel.getRecipients(notificationId);
  return rows.map(formatRecipient);
};

export const assignRecipients = async (notificationId, payload) => {
  const created = await recipientModel.addRecipient({
    notification_id: notificationId,
    recipient_name: payload.recipient_name.trim(),
    recipient_email: payload.recipient_email.trim(),
  });

  return formatRecipient(created);
};

export const removeRecipients = async (
  notificationId,
  recipientId
) => {
  const existing = await recipientModel.getRecipientStatus(
    notificationId,
    recipientId
  );

  if (!existing) {
    const err = new Error(
      `Recipient with id ${recipientId} not found.`
    );
    err.statusCode = 404;
    throw err;
  }

  await recipientModel.removeRecipient(
    notificationId,
    recipientId
  );

  return {
    id: Number(recipientId),
    message: "Recipient removed successfully.",
  };
};

export const getRecipientStatus = async (
  notificationId,
  recipientId
) => {
  const status = await recipientModel.getRecipientStatus(
    notificationId,
    recipientId
  );

  if (!status) {
    const err = new Error(
      `Recipient with id ${recipientId} not found.`
    );
    err.statusCode = 404;
    throw err;
  }

  return status;
};

export default {
  getRecipients,
  assignRecipients,
  removeRecipients,
  getRecipientStatus,
};