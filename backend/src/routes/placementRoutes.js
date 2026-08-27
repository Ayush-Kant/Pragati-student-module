import express from "express";
import authenticateJWT from "../middleware/authMiddleware.js";
import { extractStudentId, enforceStudentIsolation } from "../middleware/placementMiddleware.js";
import {
  validateApplication,
  validateApplicationStatus,
  validateInterview,
  validateApplicationOwnership,
  validateInterviewOwnership,
  validateDateRange,
} from "../validations/placementValidation.js";

import placementController from "../controllers/studentPlacementController.js";

const router = express.Router();

router.use(authenticateJWT, extractStudentId, enforceStudentIsolation);

// --- Placement Dashboard ---
router.get("/dashboard", placementController.getPlacementDashboard);

// --- Applications Management ---
router.get("/applications", placementController.getApplications);
router.get(
  "/applications/:applicationId",
  validateApplicationOwnership,
  placementController.getApplicationById
);
router.post("/applications", validateApplication, placementController.createApplication);
router.patch(
  "/applications/:applicationId/status",
  validateApplicationOwnership,
  validateApplicationStatus,
  placementController.updateApplicationStatus
);
router.delete(
  "/applications/:applicationId",
  validateApplicationOwnership,
  placementController.deleteApplication
);

// --- Interviews Management ---
router.get("/interviews", placementController.getInterviews);
router.get(
  "/interviews/:interviewId",
  validateInterviewOwnership,
  placementController.getInterviewById
);
router.post("/interviews", validateInterview, placementController.createInterview);
router.patch(
  "/interviews/:interviewId",
  validateInterviewOwnership,
  placementController.updateInterview
);

// --- Skills & Readiness ---
router.get("/skills", placementController.getSkillReadiness);
router.get("/skills/gaps", placementController.getSkillGaps);
router.get("/readiness", placementController.getReadinessReport);

// --- Analytics & Recommendations ---
router.get("/analytics", validateDateRange, placementController.getPlacementAnalytics);
router.get("/recommendations", placementController.getCareerRecommendations);

export default router;
