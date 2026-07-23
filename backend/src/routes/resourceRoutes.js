import express from "express";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
import authorizeStudent from "../middleware/authorizeStudent.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validateCourse } from "../validators/trainingValidator.js";
import { validateLessonId, validateResource } from "../validators/resourceValidator.js";
import {
    getResources,
    getResourcesByCourse,
    downloadResource,
} from "../controllers/resourceController.js";

const router = express.Router();

router.use(authenticateJWT, authorizeStudent);
router.get("/courses/:id/resources", validateRequest(validateCourse, "params"), getResourcesByCourse);
router.get("/resources", validateRequest(validateLessonId, "query"), getResources);
router.get("/resources/:id/download", validateRequest(validateResource, "params"), downloadResource);

export default router;