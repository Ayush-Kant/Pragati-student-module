// ─────────────────────────────────────────────────────────────────────────────
//  src/routes/projectRoutes.js
//  Exposes all project-related HTTP endpoints under /api/student/projects
//
//  Routes:
//    GET  /api/student/projects/:projectId                           → getProjectDetails
//    POST /api/student/projects/:projectId/milestones/:milestoneId/submit → submitMilestone
//    POST /api/student/projects/:projectId/submit                    → submitFinalProject
// ─────────────────────────────────────────────────────────────────────────────

import express from "express";

import {
  getProjectDetails,
  submitMilestone,
  submitFinalProject,
} from "../controllers/projectController.js";

import { authenticateJWT } from "../middleware/authenticateJWT.js";
import { authorizeStudent } from "../middleware/authorizeStudent.js";
import { uploadReportMiddleware } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Apply auth guards to all project routes
router.use(authenticateJWT, authorizeStudent);

// ── Project Details ────────────────────────────────────────────────────────
router.get("/:projectId", getProjectDetails);

// ── Milestone Submission ───────────────────────────────────────────────────
router.post("/:projectId/milestones/:milestoneId/submit", submitMilestone);
router.post("/:projectId/milestones/:milestoneId", submitMilestone);

// ── Final Project Submission (optional PDF via multipart/form-data) ────────
router.post("/:projectId/submit", uploadReportMiddleware, submitFinalProject);

export default router;
