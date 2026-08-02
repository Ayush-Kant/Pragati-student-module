import * as notificationService from "../services/notification.service.js";

export const getNotifications = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await notificationService.getNotifications({
      userId: req.user.id,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });

    return res.status(200).json({
      success: true,
      data: {
        notifications: result.notifications,
        unreadCount: result.unreadCount,
        page: result.page,
        limit: result.limit,
        total: result.total,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { notificationIds, markAll } = req.body;
    const result = await notificationService.markAsRead({
      userId: req.user.id,
      notificationIds,
      markAll,
    });

    return res.status(200).json({
      success: true,
      updatedCount: result.updatedCount,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const sendNotification = async (req, res) => {
  try {
    const { userIds, title, message, type, linkUrl, sendEmail, role } =
      req.body;
    const result = await notificationService.sendNotification({
      userIds,
      title,
      message,
      type,
      linkUrl,
      sendEmail: sendEmail || false,
      role,
    });

    return res.status(201).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
