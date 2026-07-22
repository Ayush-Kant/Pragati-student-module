import express from "express";
import * as PlacementDriveController from "../controllers/placementDriveController.js";
import * as EligibilityController from "../controllers/eligibility.controller.js";
import * as InterviewRoundController from "../controllers/interviewRoundController.js";
import * as ScheduleController from "../controllers/scheduleController.js";
import { 
  validatePlacementDrive, 
  validateEligibility, 
  validateInterviewRound, 
  validateSchedule 
} from "../validators/requestValidator.js";

// Optional: Import your auth/role middleware. 
// For now we will assume authMiddleware exists and protects the routes.
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// ----------------------------------------------------
// SEARCH & STATISTICS (Must be before /:id routes)
// ----------------------------------------------------
router.get("/search", authMiddleware, PlacementDriveController.searchPlacementDrives);
router.get("/statistics", authMiddleware, PlacementDriveController.getDriveStatistics);

// ----------------------------------------------------
// PLACEMENT DRIVES
// ----------------------------------------------------
router.get("/", authMiddleware, PlacementDriveController.getPlacementDrives);
router.get("/:id", authMiddleware, PlacementDriveController.getPlacementDriveById);
router.post(
  "/", 
  authMiddleware, 
  roleMiddleware("admin"), 
  validatePlacementDrive, 
  PlacementDriveController.createPlacementDrive
);
router.put(
  "/:id", 
  authMiddleware, 
  roleMiddleware("admin"), 
  validatePlacementDrive, 
  PlacementDriveController.updatePlacementDrive
);
router.delete(
  "/:id", 
  authMiddleware, 
  roleMiddleware("admin"), 
  PlacementDriveController.deletePlacementDrive
);

// ----------------------------------------------------
// ELIGIBILITY
// ----------------------------------------------------
router.get("/:id/eligibility", authMiddleware, EligibilityController.getEligibility);
router.post(
  "/:id/eligibility", 
  authMiddleware, 
  roleMiddleware("admin"), 
  validateEligibility, 
  EligibilityController.createEligibility
);
router.put(
  "/:id/eligibility", 
  authMiddleware, 
  roleMiddleware("admin"), 
  validateEligibility, 
  EligibilityController.updateEligibility
);
router.delete(
  "/:id/eligibility", 
  authMiddleware, 
  roleMiddleware("admin"), 
  EligibilityController.deleteEligibility
);

// ----------------------------------------------------
// INTERVIEW ROUNDS
// ----------------------------------------------------
router.get("/:id/rounds", authMiddleware, InterviewRoundController.getInterviewRounds);
router.post(
  "/:id/rounds", 
  authMiddleware, 
  roleMiddleware("admin"), 
  validateInterviewRound, 
  InterviewRoundController.createInterviewRound
);
router.put(
  "/:id/rounds/:roundId", 
  authMiddleware, 
  roleMiddleware("admin"), 
  validateInterviewRound, 
  InterviewRoundController.updateInterviewRound
);
router.delete(
  "/:id/rounds/:roundId", 
  authMiddleware, 
  roleMiddleware("admin"), 
  InterviewRoundController.deleteInterviewRound
);

// ----------------------------------------------------
// SCHEDULE
// ----------------------------------------------------
router.get("/:id/schedule", authMiddleware, ScheduleController.getDriveSchedule);
router.put(
  "/:id/schedule", 
  authMiddleware, 
  roleMiddleware("admin"), 
  validateSchedule, 
  ScheduleController.updateSchedule
);

export default router;
