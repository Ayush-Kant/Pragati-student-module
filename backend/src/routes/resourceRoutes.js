import express from "express";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
import authorizeStudent from "../middleware/authorizeStudent.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validateLessonId, validateResource } from "../../validators/resourceValidator.js";
import {
    getResources,
    downloadResource,
} from "../controllers/resourceController.js";

const router = express.Router();

router.use(authenticateJWT, authorizeStudent);
router.get("/resources", validateRequest(validateLessonId, "query"), getResources);
router.get("/resources/:id/download", validateRequest(validateResource, "params"), downloadResource);

export default router;