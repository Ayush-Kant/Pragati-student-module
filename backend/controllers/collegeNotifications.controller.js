import * as service from "../services/collegeNotifications.service.js";

/**
 * Location:
 * backend/controllers/collegeNotifications.controller.js
 */

export const getNotifications = async (req, res) => {
  try {
    const notifications = await service.getNotifications();
    res.status(200).json(notifications);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
};

export const getNotificationById = async (req, res) => {
  try {
    const notification = await service.getNotification(req.params.id);
    res.status(200).json(notification);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
};

export const createNotification = async (req, res) => {
  try {
    const notification = await service.addNotification(req.body);

    res.status(201).json({
      message: "Notification created successfully.",
      notification,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
};

export const updateNotification = async (req, res) => {
  try {
    const notification = await service.editNotification(
      req.params.id,
      req.body
    );

    res.status(200).json({
      message: "Notification updated successfully.",
      notification,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const result = await service.removeNotification(req.params.id);

    res.status(200).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
};

export const sendNotification = async (req, res) => {
  try {
    const notification = await service.sendNotification(req.params.id);

    res.status(200).json({
      message: "Notification sent successfully.",
      notification,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
};

export const getNotificationHistory = async (req, res) => {
  try {
    const history = await service.getNotificationHistory();

    res.status(200).json(history);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
};

export default {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  sendNotification,
  getNotificationHistory,
};