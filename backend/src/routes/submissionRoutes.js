import express from "express";
import submissionController from "../controllers/submissionController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validateAssignmentParams } from "../validators/assignmentValidator.js";
import { validateSubmission } from "../validators/submissionValidator.js";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
import { authorizeStudent } from "../middleware/authorizeStudent.js";

const router = express.Router();

router.use(authenticateJWT, authorizeStudent);
router.post("/:id/submit", validateRequest(validateAssignmentParams, "params"), validateRequest(validateSubmission, "body"), submissionController.submitAssignment);
router.put("/:id/submission", validateRequest(validateAssignmentParams, "params"), validateRequest(validateSubmission, "body"), submissionController.updateSubmission);
router.get("/:id/submission", validateRequest(validateAssignmentParams, "params"), submissionController.getSubmissionHistory);

export default router;
