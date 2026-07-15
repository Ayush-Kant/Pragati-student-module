import * as notificationModel from "../models/collegeNotifications.model.js";

/**
 * Location:
 * backend/services/collegeNotifications.service.js
 */

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

export const sendNotification = async (id) => {
  const existing = await notificationModel.getNotificationById(id);

  if (!existing) {
    const err = new Error(`Notification with id ${id} not found.`);
    err.statusCode = 404;
    throw err;
  }

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