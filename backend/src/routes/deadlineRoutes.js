import express from "express";
import deadlineController from "../controllers/deadlineController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validateAssignmentParams } from "../validators/assignmentValidator.js";
import { validateDeadline } from "../validators/deadlineValidator.js";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
import { authorizeStudent } from "../middleware/authorizeStudent.js";

const router = express.Router();

router.use(authenticateJWT, authorizeStudent);
router.get("/deadlines", deadlineController.getDeadlines);
router.patch("/:id/deadline", validateRequest(validateAssignmentParams, "params"), validateRequest(validateDeadline, "body"), deadlineController.updateDeadline);

export default router;
