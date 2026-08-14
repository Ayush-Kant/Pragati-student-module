import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { requireRole, authorizeProjectLeader, authorizeProjectMember } from "../middleware/roleMiddleware.js";
import { uploadProjectFiles } from "../middleware/uploadMiddleware.js";

import {
  // Project CRUD
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  archiveProject,

  // Team Management
  getTeamMembers,
  addMember,
  updateMemberRole,
  removeMember,

  // Milestones
  getMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,

  // Tasks
  getTasks,
  createTask,
  updateTask,
  deleteTask,

  // Submissions
  getSubmissions,
  submitProject,
  updateSubmission,

  // File Attachments
  uploadFiles,
  deleteFile,

  // GitHub Repository
  getRepository,
  updateRepository,

  // Mentor Reviews
  getReviews,
  createReview,
  updateReview,

  // Analytics
  getAnalytics,
} from "../controllers/projectController.js";

const router = Router();

// ─── Apply JWT authentication to ALL project routes ───────────────────────────
router.use(authMiddleware);

// ─── Project CRUD ─────────────────────────────────────────────────────────────
// GET  /api/student/projects
router.get("/", getProjects);

// GET  /api/student/projects/:projectId
router.get("/:projectId", authorizeProjectMember, getProjectById);

// POST /api/student/projects
router.post("/", createProject);

// PUT  /api/student/projects/:projectId
router.put("/:projectId", authorizeProjectLeader, updateProject);

// DELETE /api/student/projects/:projectId  (archives the project)
router.delete("/:projectId", authorizeProjectLeader, archiveProject);

// ─── Team Management ──────────────────────────────────────────────────────────
// GET  /api/student/projects/:projectId/members
router.get("/:projectId/members", authorizeProjectMember, getTeamMembers);

// POST /api/student/projects/:projectId/members
router.post("/:projectId/members", authorizeProjectLeader, addMember);

// PUT  /api/student/projects/:projectId/members/:memberId
router.put("/:projectId/members/:memberId", authorizeProjectLeader, updateMemberRole);

// DELETE /api/student/projects/:projectId/members/:memberId
router.delete("/:projectId/members/:memberId", authorizeProjectLeader, removeMember);

// ─── Milestones ───────────────────────────────────────────────────────────────
// GET  /api/student/projects/:projectId/milestones
router.get("/:projectId/milestones", authorizeProjectMember, getMilestones);

// POST /api/student/projects/:projectId/milestones
router.post("/:projectId/milestones", authorizeProjectMember, createMilestone);

// PUT  /api/student/projects/:projectId/milestones/:milestoneId
router.put("/:projectId/milestones/:milestoneId", authorizeProjectMember, updateMilestone);

// DELETE /api/student/projects/:projectId/milestones/:milestoneId
router.delete("/:projectId/milestones/:milestoneId", authorizeProjectLeader, deleteMilestone);

// ─── Tasks ────────────────────────────────────────────────────────────────────
// GET  /api/student/projects/:projectId/tasks
router.get("/:projectId/tasks", authorizeProjectMember, getTasks);

// POST /api/student/projects/:projectId/tasks
router.post("/:projectId/tasks", authorizeProjectMember, createTask);

// PUT  /api/student/projects/:projectId/tasks/:taskId
router.put("/:projectId/tasks/:taskId", authorizeProjectMember, updateTask);

// DELETE /api/student/projects/:projectId/tasks/:taskId
router.delete("/:projectId/tasks/:taskId", authorizeProjectLeader, deleteTask);

// ─── Project Submissions ──────────────────────────────────────────────────────
// GET  /api/student/projects/:projectId/submissions
router.get("/:projectId/submissions", authorizeProjectMember, getSubmissions);

// POST /api/student/projects/:projectId/submissions
router.post("/:projectId/submissions", authorizeProjectMember, submitProject);

// PUT  /api/student/projects/:projectId/submissions/:submissionId
router.put("/:projectId/submissions/:submissionId", authorizeProjectLeader, updateSubmission);

// ─── File Attachments ─────────────────────────────────────────────────────────
// POST /api/student/projects/:projectId/files
router.post("/:projectId/files", authorizeProjectMember, uploadProjectFiles, uploadFiles);

// DELETE /api/student/projects/:projectId/files/:fileId
router.delete("/:projectId/files/:fileId", authorizeProjectMember, deleteFile);

// ─── GitHub Repository ────────────────────────────────────────────────────────
// GET  /api/student/projects/:projectId/repository
router.get("/:projectId/repository", authorizeProjectMember, getRepository);

// PUT  /api/student/projects/:projectId/repository
router.put("/:projectId/repository", authorizeProjectLeader, updateRepository);

// ─── Mentor Reviews ───────────────────────────────────────────────────────────
// GET  /api/student/projects/:projectId/reviews
router.get("/:projectId/reviews", requireRole("MENTOR", "ADMIN"), authorizeProjectMember, getReviews);

// POST /api/student/projects/:projectId/reviews
router.post("/:projectId/reviews", requireRole("MENTOR", "ADMIN"), authorizeProjectMember, createReview);

// PUT  /api/student/projects/:projectId/reviews/:reviewId
router.put("/:projectId/reviews/:reviewId", requireRole("MENTOR", "ADMIN"), authorizeProjectMember, updateReview);

// ─── Analytics ────────────────────────────────────────────────────────────────
// GET  /api/student/projects/:projectId/analytics
router.get("/:projectId/analytics", authorizeProjectMember, getAnalytics);

export default router;
