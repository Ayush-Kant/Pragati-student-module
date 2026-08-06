import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  getNotifications,
  markAsRead,
  sendNotification,
} from "../controllers/notifications.controller.js";
import {
  validateSendNotification,
  validateMarkAsRead,
  validateGetNotifications,
} from "../validators/notifications.validator.js";

const router = express.Router();

router.get("/", authMiddleware, validateGetNotifications, getNotifications);
router.put("/read", authMiddleware, validateMarkAsRead, markAsRead);

router.post(
  "/send",
  authMiddleware,
  roleMiddleware("admin", "mentor"),
  validateSendNotification,
  sendNotification,
);

export default router;
