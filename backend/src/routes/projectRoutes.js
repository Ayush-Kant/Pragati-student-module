<<<<<<< HEAD
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
=======
import { Router } from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import { uploadProjectFiles } from "../middleware/uploadMiddleware.js";
import {
  getProjects,
  getProjectById,
  getMilestones,
  getTasks,
  getSubmissions,
  getReviews,
  getAnalytics,
  createProject,
  createMilestone,
  createTask,
  submitProject,
  uploadFiles,
  updateProject,
  updateTask,
  updateMilestone,
  deleteFile,
} from "../controllers/projectController.js";

const router = Router();

// Apply JWT authentication to all project routes
router.use(authMiddleware);

// ─── GET Endpoints ────────────────────────────────────────────────────────────
router.get("/", getProjects);
router.get("/:projectId", getProjectById);
router.get("/:projectId/milestones", getMilestones);
router.get("/:projectId/tasks", getTasks);
router.get("/:projectId/submissions", getSubmissions);
router.get("/:projectId/reviews", getReviews);
router.get("/:projectId/analytics", getAnalytics);

// ─── POST Endpoints ───────────────────────────────────────────────────────────
router.post("/", createProject);
router.post("/:projectId/milestones", createMilestone);
router.post("/:projectId/tasks", createTask);
router.post("/:projectId/submit", submitProject);
router.post("/:projectId/files", uploadProjectFiles, uploadFiles);

// ─── PUT Endpoints ────────────────────────────────────────────────────────────
router.put("/:projectId", updateProject);
router.put("/:projectId/tasks/:taskId", updateTask);
router.put("/:projectId/milestones/:milestoneId", updateMilestone);

// ─── DELETE Endpoints ─────────────────────────────────────────────────────────
router.delete("/:projectId/files/:fileId", deleteFile);
>>>>>>> b58e0407 (feat: projects backend implementation)

export default router;
