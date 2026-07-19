import express from "express";
const router = express.Router();

import authMiddleware from "../middleware/authMiddleware.js";
import { getDashboardData } from "../controllers/college.dashboard.controller.js";

router.get("/", authMiddleware, getDashboardData);

export default router;