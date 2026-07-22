// feedbackRoutes.js
import express from "express";
import feedbackController from "../controllers/feedbackController.js";
import { validateFeedback } from "../validators/feedbackValidator.js";
import authenticateJWT from "../middleware/authenticateJWT.js";
import authorizeStudent from "../middleware/authorizeStudent.js";
import errorHandler from "../middleware/errorHandler.js";

const router = express.Router();

// Retrieve feedback report
router.get(
  "/:projectId/feedback",
  authenticateJWT,
  authorizeStudent,
  validateFeedback,
  feedbackController.getFeedback
);

router.use(errorHandler);

export default router;
