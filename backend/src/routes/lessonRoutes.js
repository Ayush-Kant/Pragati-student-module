import express from "express";
import {
    getLessons,
    getLessonById,
    updateLessonProgress,
} from "../controllers/lessonController.js";

const router = express.Router();

router.get("/modules/:id/lessons", getLessons);
router.get("/lessons/:id", getLessonById);
router.patch("/lessons/:id/progress", updateLessonProgress);

export default router;