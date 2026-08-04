import express from "express";
import * as PlacementDriveController from "../controllers/placementDriveController.js";
import * as EligibilityController from "../controllers/eligibility.controller.js";
import * as InterviewRoundController from "../controllers/interviewRoundController.js";
import * as ScheduleController from "../controllers/scheduleController.js";
import * as DriveNominationsController from "../controllers/driveNominations.controller.js";
import {
  validatePlacementDrive,
  validateEligibility,
  validateInterviewRound,
  validateSchedule
} from "../validators/requestValidator.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Optional auth helper for GET endpoints
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authMiddleware(req, res, next);
  }
  next();
};

// ----------------------------------------------------
// SEARCH & STATISTICS (Must be before /:id routes)
// ----------------------------------------------------
router.get("/search", optionalAuth, PlacementDriveController.searchPlacementDrives);
router.get("/statistics", optionalAuth, PlacementDriveController.getDriveStatistics);

// ----------------------------------------------------
// PLACEMENT DRIVES
// ----------------------------------------------------
router.get("/", optionalAuth, PlacementDriveController.getPlacementDrives);
router.get("/:id", optionalAuth, PlacementDriveController.getPlacementDriveById);
router.post(
  "/",
  validatePlacementDrive,
  PlacementDriveController.createPlacementDrive
);
router.put(
  "/:id",
  validatePlacementDrive,
  PlacementDriveController.updatePlacementDrive
);
router.delete(
  "/:id",
  PlacementDriveController.deletePlacementDrive
);

// ----------------------------------------------------
// ELIGIBILITY
// ----------------------------------------------------
router.get("/:id/eligibility", optionalAuth, EligibilityController.getEligibility);
router.post(
  "/:id/eligibility",
  validateEligibility,
  EligibilityController.createEligibility
);
router.put(
  "/:id/eligibility",
  validateEligibility,
  EligibilityController.updateEligibility
);
router.delete(
  "/:id/eligibility",
  EligibilityController.deleteEligibility
);

// ----------------------------------------------------
// INTERVIEW ROUNDS
// ----------------------------------------------------
router.get("/:id/rounds", optionalAuth, InterviewRoundController.getInterviewRounds);
router.post(
  "/:id/rounds",
  validateInterviewRound,
  InterviewRoundController.createInterviewRound
);
router.put(
  "/:id/rounds/:roundId",
  validateInterviewRound,
  InterviewRoundController.updateInterviewRound
);
router.delete(
  "/:id/rounds/:roundId",
  InterviewRoundController.deleteInterviewRound
);

// ----------------------------------------------------
// SCHEDULE
// ----------------------------------------------------
router.get("/:id/schedule", optionalAuth, ScheduleController.getDriveSchedule);
router.put(
  "/:id/schedule",
  validateSchedule,
  ScheduleController.updateSchedule
);

// ----------------------------------------------------
// DRIVE-SCOPED NOMINATIONS (College Placement Module)
// ----------------------------------------------------

// GET  /placement-drives/:id/eligible       — students eligible for this drive
router.get(
  "/:id/eligible",
  authMiddleware,
  DriveNominationsController.getEligibleStudents
);

// GET  /placement-drives/:id/nominees       — students registered/awaiting approval
router.get(
  "/:id/nominees",
  authMiddleware,
  DriveNominationsController.getNominees
);

// GET  /placement-drives/:id/nominations    — all nominations for a drive
router.get(
  "/:id/nominations",
  authMiddleware,
  DriveNominationsController.getDriveNominations
);

// PUT  /placement-drives/:id/eligibility/:sid — approve or reject a student
router.put(
  "/:id/eligibility/:sid",
  authMiddleware,
  DriveNominationsController.setStudentEligibility
);

// POST /placement-drives/:id/nominate       — bulk nominate students
router.post(
  "/:id/nominate",
  authMiddleware,
  DriveNominationsController.nominateStudents
);

// PUT  /placement-drives/:id/shortlist      — bulk shortlist nominated students
router.put(
  "/:id/shortlist",
  authMiddleware,
  DriveNominationsController.shortlistStudents
);

export default router;

