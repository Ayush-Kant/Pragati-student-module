import { Router } from "express";
import {
  getBadges,
  getStudentBadgesController,
} from "../controllers/badges.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, getBadges);

router.get("/students/:id", authMiddleware, getStudentBadgesController);

// To support GET /api/v1/students/:id/badges as well (as requested in Step 7)
router.get("/students/:id/badges", authMiddleware, getStudentBadgesController);

export default router;
