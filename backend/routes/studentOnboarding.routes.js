import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import studentResumeUpload from "../middleware/studentResumeUpload.js";
import {
  getOnboardingState,
  saveOnboardingStep,
} from "../controllers/studentOnboarding.controller.js";

const router = express.Router();

router.use(authMiddleware, roleMiddleware("student"));

router.get("/", getOnboardingState);
router.put("/step/:stepNumber", (req, res, next) => {
  const step = Number(req.params.stepNumber);
  if (step === 4) return studentResumeUpload.single("resume")(req, res, next);
  return next();
}, saveOnboardingStep);

export default router;
