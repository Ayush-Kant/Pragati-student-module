import express from "express";
import {
    getCourseProgress,
    updateCourseProgress,
    getLearningStatistics,
} from "../controllers/progressController.js";

const router = express.Router();

router.get("/progress", getCourseProgress);
router.patch("/progress", updateCourseProgress);
router.get("/statistics", getLearningStatistics);

export default router;