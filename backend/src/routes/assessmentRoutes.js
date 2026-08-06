import express from "express";
import * as assessmentController from "../controllers/assessmentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  validateAssessmentIdParam,
  validateSubmitAssessment,
  validateHistoryQuery,
} from "../validations/assessmentValidation.js";

const router = express.Router();

router.use(authMiddleware, roleMiddleware("student"));

router.get("/history", validateHistoryQuery, assessmentController.getAssessmentHistory);

router.get("/", assessmentController.getAvailableAssessments);

router.get("/:assessmentId", validateAssessmentIdParam, assessmentController.getAssessmentDetails);

router.get(
  "/:assessmentId/result",
  validateAssessmentIdParam,
  assessmentController.getAssessmentResult
);

router.post(
  "/:assessmentId/start",
  validateAssessmentIdParam,
  assessmentController.startAssessment
);

router.post(
  "/:assessmentId/submit",
  validateAssessmentIdParam,
  validateSubmitAssessment,
  assessmentController.submitAssessment
);

export default router;
