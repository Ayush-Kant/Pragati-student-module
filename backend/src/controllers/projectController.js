import * as projectService from "../services/projectService.js";
import {
  createProjectSchema,
  updateProjectSchema,
  createMilestoneSchema,
  updateMilestoneSchema,
  createTaskSchema,
  updateTaskSchema,
  submitProjectSchema,
} from "../validations/projectValidation.js";

/**
 * Get user ID from authenticated JWT payload
 */
const getUserId = (req) => {
  return req.user ? req.user.id || req.user.userId || req.user.uid || null : null;
};

/**
 * Require valid authenticated user ID or send 401 response
 */
const requireUserId = (req, res) => {
  const userId = getUserId(req);
  if (!userId) {
    res.status(401).json({
      success: false,
      error: "Unauthorized",
      message: "User authentication required.",
    });
    return null;
  }
  return userId;
};

// ─── GET /api/student/projects ────────────────────────────────────────────────
export const getProjects = async (req, res, next) => {
  try {
    const { category, status, search, page, pageSize } = req.query;
    const result = await projectService.getAllProjects(
      { category, status, search },
      { page, pageSize }
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/student/projects/:projectId ─────────────────────────────────────
export const getProjectById = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const result = await projectService.getProjectById(parseInt(projectId, 10));
    if (!result.success) {
      return res.status(result.statusCode || 404).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/student/projects/:projectId/milestones ──────────────────────────
export const getMilestones = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const result = await projectService.getProjectMilestones(parseInt(projectId, 10));
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/student/projects/:projectId/tasks ───────────────────────────────
export const getTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const result = await projectService.getProjectTasks(parseInt(projectId, 10));
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/student/projects/:projectId/submissions ─────────────────────────
export const getSubmissions = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const result = await projectService.getSubmissionHistory(parseInt(projectId, 10));
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/student/projects/:projectId/reviews ─────────────────────────────
export const getReviews = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const result = await projectService.getMentorReviews(parseInt(projectId, 10));
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/student/projects/:projectId/analytics ───────────────────────────
export const getAnalytics = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const result = await projectService.getProjectAnalytics(parseInt(projectId, 10));
    if (!result.success) {
      return res.status(result.statusCode || 404).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/student/projects ───────────────────────────────────────────────
export const createProject = async (req, res, next) => {
  try {
    const { error, value } = createProjectSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        details: error.details.map((d) => d.message),
      });
    }

    const userId = requireUserId(req, res);
    if (!userId) return;

    const result = await projectService.createProject(value, userId);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/student/projects/:projectId/milestones ────────────────────────
export const createMilestone = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { error, value } = createMilestoneSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        details: error.details.map((d) => d.message),
      });
    }

    const userId = requireUserId(req, res);
    if (!userId) return;

    const result = await projectService.createMilestone(parseInt(projectId, 10), value, userId);
    if (!result.success) {
      return res.status(result.statusCode || 400).json(result);
    }
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/student/projects/:projectId/tasks ──────────────────────────────
export const createTask = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { error, value } = createTaskSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        details: error.details.map((d) => d.message),
      });
    }

    const userId = requireUserId(req, res);
    if (!userId) return;

    const result = await projectService.createTask(parseInt(projectId, 10), value, userId);
    if (!result.success) {
      return res.status(result.statusCode || 400).json(result);
    }
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/student/projects/:projectId/submit ─────────────────────────────
export const submitProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { error, value } = submitProjectSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        details: error.details.map((d) => d.message),
      });
    }

    const userId = requireUserId(req, res);
    if (!userId) return;

    const result = await projectService.submitProject(parseInt(projectId, 10), value, userId);
    if (!result.success) {
      return res.status(result.statusCode || 400).json(result);
    }
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/student/projects/:projectId/files ──────────────────────────────
export const uploadFiles = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const files = req.files || (req.file ? [req.file] : []);

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No files uploaded",
      });
    }

    const userId = requireUserId(req, res);
    if (!userId) return;

    const result = await projectService.uploadProjectFiles(parseInt(projectId, 10), files, userId);
    if (!result.success) {
      return res.status(result.statusCode || 400).json(result);
    }
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/student/projects/:projectId ─────────────────────────────────────
export const updateProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { error, value } = updateProjectSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        details: error.details.map((d) => d.message),
      });
    }

    const userId = requireUserId(req, res);
    if (!userId) return;

    const result = await projectService.updateProject(parseInt(projectId, 10), value, userId);
    if (!result.success) {
      return res.status(result.statusCode || 400).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/student/projects/:projectId/tasks/:taskId ───────────────────────
export const updateTask = async (req, res, next) => {
  try {
    const { projectId, taskId } = req.params;
    const { error, value } = updateTaskSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        details: error.details.map((d) => d.message),
      });
    }

    const userId = requireUserId(req, res);
    if (!userId) return;

    const result = await projectService.updateTaskStatus(
      parseInt(projectId, 10),
      parseInt(taskId, 10),
      value,
      userId
    );
    if (!result.success) {
      return res.status(result.statusCode || 400).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/student/projects/:projectId/milestones/:milestoneId ─────────────
export const updateMilestone = async (req, res, next) => {
  try {
    const { projectId, milestoneId } = req.params;
    const { error, value } = updateMilestoneSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        details: error.details.map((d) => d.message),
      });
    }

    const userId = requireUserId(req, res);
    if (!userId) return;

    const result = await projectService.updateMilestone(
      parseInt(projectId, 10),
      parseInt(milestoneId, 10),
      value,
      userId
    );
    if (!result.success) {
      return res.status(result.statusCode || 400).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/student/projects/:projectId/files/:fileId ────────────────────
export const deleteFile = async (req, res, next) => {
  try {
    const { projectId, fileId } = req.params;
    const userId = requireUserId(req, res);
    if (!userId) return;

    const result = await projectService.deleteProjectFile(
      parseInt(projectId, 10),
      parseInt(fileId, 10),
      userId
    );
    if (!result.success) {
      return res.status(result.statusCode || 404).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
