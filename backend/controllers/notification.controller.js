import {
  getNotificationsService,
  markNotificationReadService,
  markAllNotificationsReadService,
} from "../services/notification.service.js";

// GET NOTIFICATIONS
export const getNotifications = async (
  req,
  res
) => {
  try {
    const userId = req.user.userId;

    const result =
      await getNotificationsService(userId);

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// MARK SINGLE READ
export const markNotificationRead =
  async (req, res) => {
    try {
      const userId = req.user.userId;

      const { notificationId } = req.params;

      await markNotificationReadService(
        notificationId,
        userId
      );

      return res.status(200).json({
        success: true,
        message:
          "Notification marked as read",
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

// MARK ALL READ
export const markAllNotificationsRead =
  async (req, res) => {
    try {
      const userId = req.user.userId;

      await markAllNotificationsReadService(
        userId
      );

      return res.status(200).json({
        success: true,
        message:
          "All notifications marked as read",
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };