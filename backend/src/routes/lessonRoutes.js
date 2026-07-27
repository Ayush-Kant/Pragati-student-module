import express from "express";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
import authorizeStudent from "../middleware/authorizeStudent.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validateCourse } from "../validators/trainingValidator.js";
import { validateModule } from "../validators/courseValidator.js";
import { validateLesson, validateLessonProgress } from "../validators/lessonValidator.js";
import {
    getLessons,
    getLessonsByCourse,
    getLessonById,
    updateLessonProgress,
} from "../controllers/lessonController.js";

const router = express.Router();

router.use(authenticateJWT, authorizeStudent);
router.get("/courses/:id/lessons", validateRequest(validateCourse, "params"), getLessonsByCourse);
router.get("/modules/:id/lessons", validateRequest(validateModule, "params"), getLessons);
router.get("/lessons/:id", validateRequest(validateLesson, "params"), getLessonById);
router.patch("/lessons/:id/progress", validateRequest(validateLesson, "params"), validateRequest(validateLessonProgress, "body"), updateLessonProgress);

export default router;