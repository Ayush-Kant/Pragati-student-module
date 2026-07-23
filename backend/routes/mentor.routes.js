import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import { getProfile, updateProfile } from "../controllers/mentor.controller.js";
import { getDashboard } from "../controllers/dashboardController.js";
import { validateUpdateProfile } from "../validators/mentor.validator.js";

const router = express.Router();

router.get("/profile", authMiddleware, roleMiddleware("mentor"), getProfile);
router.put(
  "/profile",
  authMiddleware,
  roleMiddleware("mentor"),
  validateUpdateProfile,
  updateProfile,
);
router.get("/dashboard", authMiddleware, getDashboard);

export default router;
