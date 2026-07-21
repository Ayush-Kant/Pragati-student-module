import express from "express";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
import authorizeStudent from "../middleware/authorizeStudent.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validateModule } from "../../validators/courseValidator.js";
import {
    getCourseModules,
    getModuleDetails,
} from "../controllers/courseController.js";

const router = express.Router();

router.use(authenticateJWT, authorizeStudent);
router.get("/courses/:id/modules", validateRequest(validateModule, "params"), getCourseModules);
router.get("/modules/:id", validateRequest(validateModule, "params"), getModuleDetails);

export default router;