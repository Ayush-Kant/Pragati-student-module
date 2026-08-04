import express from "express";
import * as assessmentController from "../controllers/assessmentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  validateAssessmentIdParam,
  validateSubmitAssessment,
  validateHistoryQuery,
} from "../validators/assessmentValidation.js";

const router = express.Router();

// All assessment routes require a valid student JWT.
router.use(authMiddleware, roleMiddleware("student"));

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