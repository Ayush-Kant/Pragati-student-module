import express from "express";
import feedbackController from "../controllers/feedbackController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validateAssignmentParams } from "../validators/assignmentValidator.js";
import { validateFeedback } from "../validators/feedbackValidator.js";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
import { authorizeStudent } from "../middleware/authorizeStudent.js";

const router = express.Router();

router.use(authenticateJWT, authorizeStudent);
router.get("/:id/feedback", validateRequest(validateAssignmentParams, "params"), feedbackController.getFeedback);
router.post("/:id/feedback", validateRequest(validateAssignmentParams, "params"), validateRequest(validateFeedback, "body"), feedbackController.addFeedback);

export default router;
