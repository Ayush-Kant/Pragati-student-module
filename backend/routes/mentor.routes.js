import express from "express";
import { getDashboard } from "../controllers/dashboard.controller.js";
import authMiddleware from "../middleware/authMiddleware.js"; // ✅ correct path - no 's', correct filename

const router = express.Router();

// GET /api/mentor/dashboard
router.get("/dashboard", authMiddleware, getDashboard);

export default router;