import express from "express";
import TrainingController from "../controllers/trainingController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  validateGetTrainings,
  validateAssignMentor,
  validateIdParam,
} from "../middleware/validation.js";

const router = express.Router();

// Apply auth and role middleware to all training routes
router.use(authMiddleware, roleMiddleware("company", "admin"));

// Route registration
router.get("/", validateGetTrainings, TrainingController.getTrainingPrograms);
router.get("/mentors", TrainingController.getMentors);
router.get("/:id", validateIdParam, TrainingController.getTrainingById);
router.patch(
  "/:id/assign-mentor",
  validateIdParam,
  validateAssignMentor,
  TrainingController.assignMentor
);
router.patch(
  "/:id/assignmentor",
  validateIdParam,
  validateAssignMentor,
  TrainingController.assignMentor
);
router.get("/:id/progress", validateIdParam, TrainingController.getProgressAnalytics);

export default router;
