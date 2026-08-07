import express from "express";
import authMiddleware from "../../../../../middleware/authMiddleware.js";
import roleMiddleware from "../../../../../middleware/roleMiddleware.js";
import {
  getAssessments,
  getAssessment,
  startAssessment,
  submitAssessment,
  getResult,
} from "../controllers/assessments.controller.js";
import {
  validateAssessmentId,
  validateAssessmentSubmission,
} from "../validators/assessments.validation.js";
import { ensureAssessmentAssigned } from "../middlewares/authorization.middleware.js";
import { ensureAttemptStarted } from "../middlewares/quizAttempt.middleware.js";
import { validateTimer } from "../middlewares/quizTimer.middleware.js";

const router = express.Router();

// ─── Global guards: every route requires authentication + student role ────────
router.use(authMiddleware);
router.use(roleMiddleware("student"));

// ─── Routes ───────────────────────────────────────────────────────────────────

// List all assessments assigned to the authenticated student (via drive membership).
router.get("/", getAssessments);

// Retrieve full assessment details — validates :id, then checks drive membership.
router.get("/:id", validateAssessmentId, ensureAssessmentAssigned, getAssessment);

// Start (or resume) an attempt — validates :id, then checks drive membership.
router.post("/:id/start", validateAssessmentId, ensureAssessmentAssigned, startAssessment);

// Submit answers — validates :id, checks membership, asserts active attempt,
// enforces time limit, then validates the answer payload structure.
router.post(
  "/:id/submit",
  validateAssessmentId,
  ensureAssessmentAssigned,
  ensureAttemptStarted,
  validateTimer,
  validateAssessmentSubmission,
  submitAssessment
);

// Fetch the graded result — validates :id, then checks drive membership.
router.get("/:id/result", validateAssessmentId, ensureAssessmentAssigned, getResult);

export default router;
