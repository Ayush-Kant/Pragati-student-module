import express from "express";
import * as assessmentController from "../controllers/assessmentController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import {
  validateAssessmentIdParam,
  validateSubmitAssessment,
  validateHistoryQuery,
} from "../validations/assessmentValidation.js";

const router = express.Router();

// All assessment routes require a valid student JWT.
router.use(authenticate, authorize("student"));

// NOTE: "/history" is registered before "/:assessmentId" so it isn't
// swallowed by the dynamic param route.
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
