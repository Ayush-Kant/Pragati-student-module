import express from "express";
import * as assignmentController from "../controllers/assignmentController.js";
import * as submissionController from "../controllers/submissionController.js";
import * as feedbackController from "../controllers/feedbackController.js";
import * as gradeController from "../controllers/gradeController.js";
import * as deadlineController from "../controllers/deadlineController.js";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
import { authorizeStudent } from "../middleware/authorizeStudent.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validateAssignment, validateAssignmentId } from "../validators/assignmentValidator.js";
import { validateSubmission } from "../validators/submissionValidator.js";
import { validateFeedback } from "../validators/feedbackValidator.js";
import { validateGrade } from "../validators/gradeValidator.js";
import { validateDeadline } from "../validators/deadlineValidator.js";

const router = express.Router();

router.use(authenticateJWT, authorizeStudent);

router.get("/", assignmentController.getAllAssignments);
router.get("/grades", gradeController.getGrades);
router.get("/deadlines", deadlineController.getDeadlines);
router.get("/:id", validateAssignmentId, assignmentController.getAssignmentById);

router.post("/:id/submit", validateAssignmentId, validateSubmission, submissionController.submitAssignment);
router.put("/:id/submission", validateAssignmentId, validateSubmission, submissionController.updateSubmission);
router.get("/:id/submission", validateAssignmentId, submissionController.getSubmissionHistory);

router.get("/:id/feedback", validateAssignmentId, feedbackController.getFeedback);
router.post("/:id/feedback", validateAssignmentId, validateFeedback, feedbackController.addFeedback);

router.patch("/:id/grade", validateAssignmentId, validateGrade, gradeController.updateGrades);
router.patch("/:id/deadline", validateAssignmentId, validateDeadline, deadlineController.updateDeadline);

export default router;
