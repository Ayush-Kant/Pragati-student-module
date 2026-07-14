import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  getAssessments,
  getAssessment,
  startAssessment,
  submitAssessment,
  getResult,
} from "../controllers/student.assessment.controller.js";
import { validateAssessmentSubmission } from "../validators/student.assessment.validator.js";

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware("student"));

router.get("/", getAssessments);
router.get("/:id", getAssessment);
router.post("/:id/start", startAssessment);
router.post("/:id/submit", validateAssessmentSubmission, submitAssessment);
router.get("/:id/result", getResult);

export default router;
