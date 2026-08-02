import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  getMentees,
  getMenteeProfile,
  updateMenteeNotes,
} from "../controllers/mentor.mentees.controller.js";

const router = express.Router();

// Fetch all mentees, stats, and progress
router.get("/mentees", authMiddleware, roleMiddleware("mentor"), getMentees);

// Fetch detailed profile for the slide drawer
router.get(
  "/mentees/:id/profile",
  authMiddleware,
  roleMiddleware("mentor"),
  getMenteeProfile
);

// Save updated mentor notes in the drawer
router.put(
  "/mentees/:id/notes",
  authMiddleware,
  roleMiddleware("mentor"),
  updateMenteeNotes
);

export default router;
