import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  getNotifications,
  markNotificationsRead,
  markNotificationRead,
  markAllNotificationsRead,
  getNotificationPreferences,
  updateNotificationPreferences,
  subscribePush,
  unsubscribePush,
  getPushPublicKey,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.use(authMiddleware, roleMiddleware("student"));

router.get("/", getNotifications);

// PRD: PATCH /api/student/notifications/read with { notificationIds: [...] | "all" }
router.patch("/read", markNotificationsRead);

// Backwards-compatible legacy endpoints.
router.patch("/:notificationId/read", markNotificationRead);
router.patch("/mark-all-read", markAllNotificationsRead);

router.get("/preferences", getNotificationPreferences);
router.put("/preferences", updateNotificationPreferences);

router.get("/push/public-key", getPushPublicKey);
router.post("/push/subscribe", subscribePush);
router.delete("/push/subscribe", unsubscribePush);

export default router;
