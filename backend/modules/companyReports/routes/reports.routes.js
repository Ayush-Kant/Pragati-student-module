import { Router } from "express";

import * as reportsController from "../controllers/reports.controller.js";
import authMiddleware from "../../../middleware/authMiddleware.js";

const router = Router();

router.get("/dashboard", authMiddleware, reportsController.getDashboard);

router.get("/conversion", authMiddleware, reportsController.getConversion);

router.get(
  "/college-performance",
  authMiddleware,
  reportsController.getCollegePerformance,
);

router.get("/skill-gap", authMiddleware, reportsController.getSkillGap);

router.get(
  "/offer-analytics",
  authMiddleware,
  reportsController.getOfferAnalytics,
);

router.get("/trends", authMiddleware, reportsController.getHiringTrends);

export default router;
