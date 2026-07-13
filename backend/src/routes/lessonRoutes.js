import express from "express";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
import authorizeStudent from "../middleware/authorizeStudent.js";
import { validateLesson, validateLessonProgress } from "../../validators/lessonValidator.js";
import {
    getLessons,
    getLessonById,
    updateLessonProgress,
} from "../controllers/lessonController.js";

const router = express.Router();

router.use(authenticateJWT, authorizeStudent);
router.get("/modules/:id/lessons", validateLesson, getLessons);
router.get("/lessons/:id", validateLesson, getLessonById);
router.patch("/lessons/:id/progress", validateLesson, validateLessonProgress, updateLessonProgress);

export default router;