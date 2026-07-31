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

export default router;
