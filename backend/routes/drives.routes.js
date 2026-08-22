import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import { getActiveMentorDrives } from "../controllers/drives.controller.js";

const router = express.Router();

router.get("/mentor/active", authMiddleware, roleMiddleware("mentor"), getActiveMentorDrives);

export default router;
