// submissionRoutes.js
import express from "express";
import submissionController from "../controllers/submissionController.js";
import { validateProject } from "../validators/projectValidator.js";
import { validateSubmission, sanitizeInput } from "../validators/submissionValidator.js";
import { upload } from "../utils/uploadHelpers.js";
import authenticateJWT from "../middleware/authenticateJWT.js";
import authorizeStudent from "../middleware/authorizeStudent.js";
import errorHandler from "../middleware/errorHandler.js";

const router = express.Router();

router.use(authenticateJWT, authorizeStudent);

// Final project submission (multipart upload supporting PDF report)
router.post(
  "/:projectId/submit",
  upload.single("report"),
  sanitizeInput,
  validateSubmission,
  submissionController.submitFinalProject
);

// Get final submission status
router.get(
  "/:projectId/submission",
  validateProject,
  submissionController.getSubmission
);

// Update submission URLs (only whitelisted fields reach SQL)
router.patch(
  "/:projectId/submission",
  validateSubmission,
  submissionController.updateSubmission
);

router.use(errorHandler);

export default router;
