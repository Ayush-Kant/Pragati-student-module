import express from "express";
import deadlineController from "../controllers/deadlineController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validateAssignmentId } from "../validators/assignmentValidator.js";
import { validateDeadline } from "../validators/deadlineValidator.js";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
import { authorizeAssignmentAccess } from "../middleware/authorizeAssignmentAccess.js";

const router = express.Router();

router.get("/deadlines", authenticateJWT, deadlineController.getDeadlines);
router.patch("/:id/deadline", authenticateJWT, authorizeAssignmentAccess, validateRequest(validateAssignmentId), validateRequest(validateDeadline), deadlineController.updateDeadline);

export default router;
