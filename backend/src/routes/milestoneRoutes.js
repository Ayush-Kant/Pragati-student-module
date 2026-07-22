// milestoneRoutes.js
import express from "express";
import milestoneController from "../controllers/milestoneController.js";
import { validateMilestone } from "../validators/milestoneValidator.js";
import { validateProject } from "../validators/projectValidator.js";
import { sanitizeInput } from "../validators/submissionValidator.js";
import authenticateJWT from "../middleware/authenticateJWT.js";
import authorizeStudent from "../middleware/authorizeStudent.js";
import errorHandler from "../middleware/errorHandler.js";

const router = express.Router();

// Apply auth to all routes in this router
router.use(authenticateJWT, authorizeStudent);

// Submit a specific milestone
router.post(
  "/:projectId/milestones/:milestoneId",
  sanitizeInput,
  validateMilestone,
  milestoneController.submitMilestone
);

// Get list of milestones for a project
router.get(
  "/:projectId/milestones",
  validateProject,
  milestoneController.getMilestones
);

router.use(errorHandler);

export default router;
