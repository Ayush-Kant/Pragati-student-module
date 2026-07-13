import express from "express";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
import authorizeStudent from "../middleware/authorizeStudent.js";
import { validateModule } from "../../validators/courseValidator.js";
import {
    getCourseModules,
    getModuleDetails,
} from "../controllers/courseController.js";

const router = express.Router();

router.use(authenticateJWT, authorizeStudent);
router.get("/courses/:id/modules", validateModule, getCourseModules);
router.get("/modules/:id", validateModule, getModuleDetails);

export default router;