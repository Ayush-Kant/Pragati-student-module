import notificationService from "../services/notification.service.js";

const parseReadFilter = (value) => {
  const normalized = String(value ?? "all").toLowerCase();
  if (!['true', 'false', 'all'].includes(normalized)) {
    const error = new Error("read must be true, false, or all");
    error.statusCode = 400;
    throw error;
  }
  return normalized;
};

export const getNotifications = async (req, res, next) => {
  try {
    const data = await notificationService.getNotifications({
      userId: req.user.id,
      read: parseReadFilter(req.query.read),
      page: req.query.page,
      limit: req.query.limit,
    });
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const markNotificationsRead = async (req, res, next) => {
  try {
    const { notificationIds } = req.body || {};
    const data = await notificationService.markAsRead({
      userId: req.user.id,
      notificationIds,
      markAll: notificationIds === 'all',
    });
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const data = await notificationService.markAsRead({
      userId: req.user.id,
      notificationIds: [req.params.notificationId],
    });
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const markAllNotificationsRead = async (req, res, next) => {
  try {
    const data = await notificationService.markAsRead({
      userId: req.user.id,
      markAll: true,
      notificationIds: 'all',
    });
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export const getNotificationPreferences = async (req, res, next) => {
  try {
    const preferences = await notificationService.getStudentPreferences(req.user);
    return res.status(200).json({ success: true, preferences });
  } catch (error) {
    return next(error);
  }
};

export const updateNotificationPreferences = async (req, res, next) => {
  try {
    const preferences = await notificationService.updateStudentPreferences(req.user, req.body?.preferences);
    return res.status(200).json({ success: true, message: "Preferences saved", preferences });
  } catch (error) {
    return next(error);
  }
};

export const subscribePush = async (req, res, next) => {
  try {
    const result = await notificationService.registerPushSubscription(req.user, req.body?.subscription);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
};

export const unsubscribePush = async (req, res, next) => {
  try {
    const result = await notificationService.removePushSubscription(req.user, req.body?.endpoint);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

export const getPushPublicKey = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, ...notificationService.getPublicPushKey() });
  } catch (error) {
    return next(error);
  }
};

export default {
  getNotifications,
  markNotificationsRead,
  markNotificationRead,
  markAllNotificationsRead,
  getNotificationPreferences,
  updateNotificationPreferences,
  subscribePush,
  unsubscribePush,
  getPushPublicKey,
};
