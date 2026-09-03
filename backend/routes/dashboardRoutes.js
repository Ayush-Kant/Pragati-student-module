import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  getDashboard,
  getLeaderboard,
  getNotifications,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.use(authMiddleware, roleMiddleware("student"));

router.get("/", getDashboard);
router.get("/leaderboard/:driveId", getLeaderboard);
router.get("/notifications", getNotifications);

export default router;
