import express from "express";
const router = express.Router();

import authMiddleware from "../middleware/authMiddleware.js";

import {
  getCollegeProfile,
  updateCollegeProfile,
  createCollegeProfile
} from "../controllers/college.profile.controller.js";

router.get(
  "/",
  authMiddleware,
  getCollegeProfile
);

router.put(
  "/",
  authMiddleware,
  updateCollegeProfile
);

router.post(
  "/",
  authMiddleware,
  createCollegeProfile
);

export default router;