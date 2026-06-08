import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

// GET ALL
router.get(
  "/",
  authMiddleware,
  getNotifications
);

// MARK SINGLE READ
router.patch(
  "/:notificationId/read",
  authMiddleware,
  markNotificationRead
);

// MARK ALL READ
router.patch(
  "/mark-all-read",
  authMiddleware,
  markAllNotificationsRead
);

export default router;