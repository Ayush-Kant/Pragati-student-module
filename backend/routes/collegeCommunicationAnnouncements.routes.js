import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import * as announcementController from "../controllers/collegeAnnouncements.controller.js";
import * as notificationController from "../controllers/collegeNotifications.controller.js";
import * as recipientController from "../controllers/collegeRecipients.controller.js";

import * as announcementValidator from "../validators/collegeAnnouncements.validator.js";
import * as notificationValidator from "../validators/collegeNotifications.validator.js";
import * as recipientValidator from "../validators/collegeRecipients.validator.js";
import * as requestValidator from "../validators/collegeRequests.validator.js";

const router = express.Router();

// Protect only the announcements and notifications subtrees.
router.use("/announcements", authMiddleware, roleMiddleware("admin"));
router.use("/notifications", authMiddleware, roleMiddleware("admin"));

/* ===========================
   Announcements
=========================== */

router.get(
  "/announcements",
  announcementController.getAnnouncements
);

router.get(
  "/announcements/:id",
  requestValidator.validateRequestId,
  announcementController.getAnnouncementById
);

router.post(
  "/announcements",
  announcementValidator.validateAnnouncement,
  announcementController.createAnnouncement
);

router.put(
  "/announcements/:id",
  requestValidator.validateRequestId,
  announcementValidator.validateAnnouncementUpdate,
  announcementController.updateAnnouncement
);

router.delete(
  "/announcements/:id",
  requestValidator.validateRequestId,
  announcementController.deleteAnnouncement
);

router.patch(
  "/announcements/:id/publish",
  requestValidator.validateRequestId,
  announcementController.publishAnnouncement
);

router.patch(
  "/announcements/:id/unpublish",
  requestValidator.validateRequestId,
  announcementController.unpublishAnnouncement
);

/* ===========================
   Notifications
=========================== */

router.get(
  "/notifications",
  notificationController.getNotifications
);

router.get(
  "/notifications/history",
  notificationController.getNotificationHistory
);

router.get(
  "/notifications/:id",
  requestValidator.validateRequestId,
  notificationController.getNotificationById
);

router.post(
  "/notifications",
  notificationValidator.validateNotification,
  notificationController.createNotification
);

router.put(
  "/notifications/:id",
  requestValidator.validateRequestId,
  notificationValidator.validateNotificationUpdate,
  notificationController.updateNotification
);

router.delete(
  "/notifications/:id",
  requestValidator.validateRequestId,
  notificationController.deleteNotification
);

router.post(
  "/notifications/:id/send",
  requestValidator.validateRequestId,
  notificationController.sendNotification
);

/* ===========================
   Recipients
=========================== */

router.get(
  "/notifications/:id/recipients",
  requestValidator.validateRequestId,
  recipientController.getRecipients
);

router.post(
  "/notifications/:id/recipients",
  requestValidator.validateRequestId,
  recipientValidator.validateRecipient,
  recipientController.assignRecipients
);

router.delete(
  "/notifications/:id/recipients/:recipientId",
  requestValidator.validateRequestId,
  recipientController.removeRecipients
);

export default router;