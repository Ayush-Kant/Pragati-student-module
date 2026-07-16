import {
  getNotificationsService,
  markNotificationsAsReadService,
  createBulkNotificationsService,
} from "../services/notification.service.js";
import { queueEmailNotification } from "../queue/email.queue.js";
import { validateSendNotification, validateMarkAsRead, validateGetQuery } from "../validators/notifications.validator.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { error, value } = validateGetQuery(req.query);

    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { page, limit } = value;
    const result = await getNotificationsService(userId, page, limit);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("[Notifications] Get Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { error, value } = validateMarkAsRead(req.body);

    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { notificationIds, markAll } = value;
    const updatedCount = await markNotificationsAsReadService(userId, notificationIds, markAll);

    return res.status(200).json({
      success: true,
      updatedCount
    });
  } catch (error) {
    console.error("[Notifications] Mark Read Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const sendNotification = async (req, res) => {
  try {
    const { error, value } = validateSendNotification(req.body);

    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { userIds, title, message, type, linkUrl, sendEmail } = value;

    // Bulk insert to DB
    await createBulkNotificationsService(userIds, { title, message, type, linkUrl });

    // Handle background email
    if (sendEmail) {
      await queueEmailNotification({ userIds, title, message, type, linkUrl });
    }

    return res.status(201).json({
      success: true,
      message: "Notifications dispatched successfully"
    });
  } catch (error) {
    console.error("[Notifications] Send Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
