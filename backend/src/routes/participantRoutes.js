import express from "express";
import participantController from "../controllers/participantController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  validateParticipant,
  validateParticipantParams,
  validateDeleteParticipantParams
} from "../validators/participantValidator.js";

const router = express.Router();

// Get participants
router.get(
  "/:id",
  validateRequest(validateParticipantParams, "params"),
  participantController.getParticipants
);

// Add participant
router.post(
  "/:id",
  validateRequest(validateParticipantParams, "params"),
  validateRequest(validateParticipant, "body"),
  participantController.addParticipant
);

// Remove participant
router.delete(
  "/:id/:studentId",
  validateRequest(validateDeleteParticipantParams, "params"),
  participantController.removeParticipant
);

export default router;