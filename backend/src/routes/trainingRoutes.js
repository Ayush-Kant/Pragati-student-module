import express from "express";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
import authorizeStudent from "../middleware/authorizeStudent.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validateCourse, validateTrainingList } from "../validators/trainingValidator.js";
import {
    getAllCourses,
    getCourseById,
} from "../controllers/trainingController.js";

const router = express.Router();

router.use(authenticateJWT, authorizeStudent);
router.get("/courses", validateRequest(validateTrainingList, "query"), getAllCourses);
router.get("/courses/:id", validateRequest(validateCourse, "params"), getCourseById);

export default router;