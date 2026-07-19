import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  updateCourseHiringRelevant,
  updateProjectHiringRelevant,
  updateDriveSkills,
  updateReadinessThreshold,
  shortlistStudent,
  saveRecommendation,
  getShortlistedStudents,
} from "../controllers/mentorHiring.controller.js";
import {
  validateHiringRelevant,
  validateDriveSkills,
  validateReadinessThreshold,
  validateShortlist,
  validateRecommendation,
} from "../validators/mentorHiring.validator.js";

const router = express.Router();

router.patch(
  "/courses/:id/hiring-relevant",
  authMiddleware,
  roleMiddleware("mentor"),
  validateHiringRelevant,
  updateCourseHiringRelevant
);

router.patch(
  "/projects/:id/hiring-relevant",
  authMiddleware,
  roleMiddleware("mentor"),
  validateHiringRelevant,
  updateProjectHiringRelevant
);

router.patch(
  "/drives/:id/skills",
  authMiddleware,
  roleMiddleware("mentor"),
  validateDriveSkills,
  updateDriveSkills
);

router.patch(
  "/drives/:id/readiness-threshold",
  authMiddleware,
  roleMiddleware("mentor"),
  validateReadinessThreshold,
  updateReadinessThreshold
);

router.patch(
  "/students/:id/shortlist",
  authMiddleware,
  roleMiddleware("mentor"),
  validateShortlist,
  shortlistStudent
);

router.patch(
  "/students/:id/recommendation",
  authMiddleware,
  roleMiddleware("mentor"),
  validateRecommendation,
  saveRecommendation
);

router.get(
  "/students/shortlisted",
  authMiddleware,
  roleMiddleware("mentor"),
  getShortlistedStudents
);

export default router;
