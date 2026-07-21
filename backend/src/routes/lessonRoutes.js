import express from "express";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
import authorizeStudent from "../middleware/authorizeStudent.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validateLesson, validateLessonProgress } from "../../validators/lessonValidator.js";
import {
    getLessons,
    getLessonById,
    updateLessonProgress,
} from "../controllers/lessonController.js";

const router = express.Router();

router.use(authenticateJWT, authorizeStudent);
router.get("/modules/:id/lessons", validateRequest(validateLesson, "params"), getLessons);
router.get("/lessons/:id", validateRequest(validateLesson, "params"), getLessonById);
router.patch("/lessons/:id/progress", validateRequest(validateLesson, "params"), validateRequest(validateLessonProgress, "body"), updateLessonProgress);

export default router;