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
router.get("/placement-drives/search", authMiddleware, PlacementDriveController.searchPlacementDrives);
router.get("/placement-drives/statistics", authMiddleware, PlacementDriveController.getDriveStatistics);

// ----------------------------------------------------
// PLACEMENT DRIVES
// ----------------------------------------------------
router.get("/placement-drives", authMiddleware, PlacementDriveController.getPlacementDrives);
router.get("/placement-drives/:id", authMiddleware, PlacementDriveController.getPlacementDriveById);
router.post(
  "/placement-drives", 
  authMiddleware, 
  roleMiddleware("admin"), 
  validatePlacementDrive, 
  PlacementDriveController.createPlacementDrive
);
router.put(
  "/placement-drives/:id", 
  authMiddleware, 
  roleMiddleware("admin"), 
  validatePlacementDrive, 
  PlacementDriveController.updatePlacementDrive
);
router.delete(
  "/placement-drives/:id", 
  authMiddleware, 
  roleMiddleware("admin"), 
  PlacementDriveController.deletePlacementDrive
);

// ----------------------------------------------------
// ELIGIBILITY
// ----------------------------------------------------
router.get("/placement-drives/:id/eligibility", authMiddleware, EligibilityController.getEligibility);
router.post(
  "/placement-drives/:id/eligibility", 
  authMiddleware, 
  roleMiddleware("admin"), 
  validateEligibility, 
  EligibilityController.createEligibility
);
router.put(
  "/placement-drives/:id/eligibility", 
  authMiddleware, 
  roleMiddleware("admin"), 
  validateEligibility, 
  EligibilityController.updateEligibility
);
router.delete(
  "/placement-drives/:id/eligibility", 
  authMiddleware, 
  roleMiddleware("admin"), 
  EligibilityController.deleteEligibility
);

// ----------------------------------------------------
// INTERVIEW ROUNDS
// ----------------------------------------------------
router.get("/placement-drives/:id/rounds", authMiddleware, InterviewRoundController.getInterviewRounds);
router.post(
  "/placement-drives/:id/rounds", 
  authMiddleware, 
  roleMiddleware("admin"), 
  validateInterviewRound, 
  InterviewRoundController.createInterviewRound
);
router.put(
  "/placement-drives/:id/rounds/:roundId", 
  authMiddleware, 
  roleMiddleware("admin"), 
  validateInterviewRound, 
  InterviewRoundController.updateInterviewRound
);
router.delete(
  "/placement-drives/:id/rounds/:roundId", 
  authMiddleware, 
  roleMiddleware("admin"), 
  InterviewRoundController.deleteInterviewRound
);

// ----------------------------------------------------
// SCHEDULE
// ----------------------------------------------------
router.get("/placement-drives/:id/schedule", authMiddleware, ScheduleController.getDriveSchedule);
router.put(
  "/placement-drives/:id/schedule", 
  authMiddleware, 
  roleMiddleware("admin"), 
  validateSchedule, 
  ScheduleController.updateSchedule
);

export default router;
