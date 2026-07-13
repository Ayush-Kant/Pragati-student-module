import express from "express";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
import authorizeStudent from "../middleware/authorizeStudent.js";
import { validateResource } from "../../validators/resourceValidator.js";
import {
    getResources,
    downloadResource,
} from "../controllers/resourceController.js";

const router = express.Router();

router.use(authenticateJWT, authorizeStudent);
router.get("/resources", getResources);
router.get("/resources/:id/download", validateResource, downloadResource);

export default router;