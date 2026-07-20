import express from "express";
import assignmentController from "../controllers/assignmentController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
import { validateAssignmentParams, validateAssignmentQuery } from "../validators/assignmentValidator.js";

const router = express.Router();

router.use(authenticateJWT);
router.get("/", validateRequest(validateAssignmentQuery, "query"), assignmentController.getAllAssignments);
router.get("/:id", validateRequest(validateAssignmentParams, "params"), assignmentController.getAssignmentById);

export default router;
