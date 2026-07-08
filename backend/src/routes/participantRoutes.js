import express from "express";
import participantController from "../controllers/participantController.js";
import authenticateJWT from "../middleware/authenticateJWT.js";
import authorizeStudent from "../middleware/authorizeStudent.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  validateParticipant,
  validateParticipantParams,
  validateDeleteParticipantParams
} from "../validators/participantValidator.js";

const router = express.Router();

router.use(authenticateJWT);
router.use(authorizeStudent);

// Get participants
router.get(
  "/:id/participants",
  validateRequest(validateParticipantParams, "params"),
  participantController.getParticipants
);

// Add participant
router.post(
  "/:id/participants",
  validateRequest(validateParticipantParams, "params"),
  validateRequest(validateParticipant, "body"),
  participantController.addParticipant
);

// Remove participant
router.delete(
  "/:id/participants/:participantId",
  validateRequest(validateDeleteParticipantParams, "params"),
  participantController.removeParticipant
);

export default router;