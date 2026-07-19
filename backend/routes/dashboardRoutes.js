import express from "express";

const router = express.Router();

import {
  getDashboard,
  getLeaderboard,
  getNotifications,
} from "../controllers/dashboardController.js";

// Dashboard
router.get("/", getDashboard);

// Leaderboard
router.get("/leaderboard/:driveId", getLeaderboard);

// Notifications
router.get("/notifications", getNotifications);

export default router;