// projectRoutes.js
import express from "express";
import projectController from "../controllers/projectController.js";
import { validateProject } from "../validators/projectValidator.js";
import authenticateJWT from "../middleware/authenticateJWT.js";
import authorizeStudent from "../middleware/authorizeStudent.js";
import errorHandler from "../middleware/errorHandler.js";

const router = express.Router();

// Student-only project details route
router.get(
  "/:projectId",
  authenticateJWT,
  authorizeStudent,
  validateProject,
  projectController.getProjectDetails
);

router.use(errorHandler);

export default router;
