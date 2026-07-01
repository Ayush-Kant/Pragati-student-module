import express from "express";
const router = express.Router();

import authMiddleware from "../middleware/authMiddleware.js";
import {
  getDashboardOverview,
  getDashboardStats,
  getDashboardActivities,
  getPlacementAnalytics,
  getRevenueAnalytics,
  getAdmissionsAnalytics
} from "../controllers/colllege.dashboard.controller.js";


router.get(
  "/",
  authMiddleware,
  getDashboardOverview,
  getDashboardStats,
  getDashboardActivities,
  getPlacementAnalytics,
  getRevenueAnalytics,
  getAdmissionsAnalytics
);

export default router;