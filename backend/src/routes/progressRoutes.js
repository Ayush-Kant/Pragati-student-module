import express from "express";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
import authorizeStudent from "../middleware/authorizeStudent.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validateProgress } from "../../validators/progressValidator.js";
import {
    getCourseProgress,
    updateCourseProgress,
    getLearningStatistics,
} from "../controllers/progressController.js";

const router = express.Router();

router.use(authenticateJWT, authorizeStudent);
router.get("/progress", getCourseProgress);
router.patch("/progress", validateRequest(validateProgress, "body"), updateCourseProgress);
router.get("/statistics", getLearningStatistics);

export default router;