import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  getNotifications,
  markAsRead,
  sendNotification
} from "../controllers/notifications.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getNotifications);
router.put("/read", authMiddleware, markAsRead);

router.post(
  "/send",
  authMiddleware,
  roleMiddleware("admin", "mentor"),
  sendNotification
);

export default router;
