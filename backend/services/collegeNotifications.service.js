import * as notificationModel from "../models/collegeNotifications.model.js";
import * as announcementModel from "../models/collegeAnnouncements.model.js";
import * as recipientModel from "../models/collegeRecipients.model.js";

const formatNotification = (row) => ({
  id: row.id,
  announcementId: row.announcement_id,
  title: row.title,
  message: row.message,
  audience: row.audience,
  status: row.status,
  scheduledAt: row.scheduled_at,
  sentAt: row.sent_at,
  createdAt: row.created_at,
});

export const getNotifications = async () => {
  const rows = await notificationModel.getAllNotifications();
  return rows.map(formatNotification);
};

export const getNotification = async (id) => {
  const notification = await notificationModel.getNotificationById(id);

  if (!notification) {
    const err = new Error(`Notification with id ${id} not found.`);
    err.statusCode = 404;
    throw err;
  }

  return formatNotification(notification);
};

export const addNotification = async (payload) => {
  const created = await notificationModel.createNotification({
    announcement_id: payload.announcement_id,
    title: payload.title.trim(),
    message: payload.message.trim(),
    audience: payload.audience,
    scheduled_at: payload.scheduled_at,
  });

  return formatNotification(created);
};

export const editNotification = async (id, payload) => {
  const existing = await notificationModel.getNotificationById(id);

  if (!existing) {
    const err = new Error(`Notification with id ${id} not found.`);
    err.statusCode = 404;
    throw err;
  }

  const updated = await notificationModel.updateNotification(id, payload);

  return formatNotification(updated);
};

export const removeNotification = async (id) => {
  const existing = await notificationModel.getNotificationById(id);

  if (!existing) {
    const err = new Error(`Notification with id ${id} not found.`);
    err.statusCode = 404;
    throw err;
  }

  await notificationModel.deleteNotification(id);

  return {
    id: Number(id),
    message: "Notification deleted successfully.",
  };
};

// B5: Complete Notification Delivery Workflow
export const sendNotification = async (id) => {
  const notification = await notificationModel.getNotificationById(id);

  if (!notification) {
    const err = new Error(`Notification with id ${id} not found.`);
    err.statusCode = 404;
    throw err;
  }

  // Step 1: Verify announcement is Published
  if (notification.announcement_id) {
    const announcement = await announcementModel.getAnnouncementById(
      notification.announcement_id
    );

    if (!announcement || announcement.status !== "Published") {
      const err = new Error(
        "Cannot send notification: The associated announcement is not published."
      );
      err.statusCode = 400;
      throw err;
    }
  }

  // Step 2: Fetch recipients
  const recipients = await recipientModel.getRecipients(id);

  if (!recipients || recipients.length === 0) {
    const err = new Error(
      "Cannot send notification: No recipients are assigned to this notification."
    );
    err.statusCode = 400;
    throw err;
  }

  // Step 3 & 4: Dispatch notifications and update recipient delivery status
  for (const recipient of recipients) {
    try {
      // Simulate/Trigger Email Dispatch
      // If integrate with a real queue/email provider, trigger here.
      await recipientModel.updateRecipientStatus(recipient.id, "Delivered");
    } catch (deliveryErr) {
      await recipientModel.updateRecipientStatus(recipient.id, "Failed");
    }
  }

  // Step 5: Mark Notification status as 'Sent'
  const sent = await notificationModel.sendNotification(id);

  return formatNotification(sent);
};

export const getNotificationHistory = async () => {
  const rows = await notificationModel.getNotificationHistory();
  return rows.map(formatNotification);
};

export default {
  getNotifications,
  getNotification,
  addNotification,
  editNotification,
  removeNotification,
  sendNotification,
  getNotificationHistory,
};