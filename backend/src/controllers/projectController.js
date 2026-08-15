import * as projectService from "../services/projectService.js";
import {
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
  updateMemberRoleSchema,
  createMilestoneSchema,
  updateMilestoneSchema,
  createTaskSchema,
  updateTaskSchema,
  submitProjectSchema,
  updateSubmissionSchema,
  updateRepositorySchema,
  createMentorReviewSchema,
  updateMentorReviewSchema,
} from "../validations/projectValidation.js";

// ─── Auth & Validation Helpers ────────────────────────────────────────────────

/**
 * Extract user ID from authenticated JWT payload
 */
const getUserId = (req) =>
  req.user ? req.user.id || req.user.userId || req.user.uid || null : null;

/**
 * Require a valid authenticated user ID; sends 401 if missing.
 * Returns the userId on success, or null after responding.
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

/**
 * Validate a request body against a Joi schema.
 * Returns `{ ok: true, value }` or sends a 400 and returns `{ ok: false }`.
 */
const validate = (schema, body, res) => {
  const { error, value } = schema.validate(body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      success: false,
      error: "Validation Error",
      details: error.details.map((d) => d.message),
    });
    return { ok: false };
  }
  return { ok: true, value };
};

/**
 * Parse a route parameter as a positive integer.
 * Returns the integer on success, or sends a 400 response and returns null.
 */
const parseId = (param, name, res) => {
  const id = parseInt(param, 10);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({
      success: false,
      error: "Invalid Parameter",
      message: `${name} must be a positive integer.`,
    });
    return null;
  }
  return id;
};

/**
 * Send the service result as an HTTP response, using the result's statusCode on failure.
 */
const respond = (res, result, successStatus = 200) => {
  if (!result.success) {
    return res.status(result.statusCode || 400).json(result);
  }
  return res.status(successStatus).json(result);
};

// ─── Project CRUD ─────────────────────────────────────────────────────────────

// GET /api/student/projects
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

// GET /api/student/projects/:projectId
export const getProjectById = async (req, res, next) => {
  try {
    const projectId = parseId(req.params.projectId, "projectId", res);
    if (!projectId) return;

    const result = await projectService.getProjectById(projectId);
    return respond(res, result);
  } catch (error) {
    next(error);
  }
};

// POST /api/student/projects
export const createProject = async (req, res, next) => {
  try {
    const { ok, value } = validate(createProjectSchema, req.body, res);
    if (!ok) return;

    const userId = requireUserId(req, res);
    if (!userId) return;

    const result = await projectService.createProject(value, userId);
    return respond(res, result, 201);
  } catch (error) {
    next(error);
  }
};

// PUT /api/student/projects/:projectId
export const updateProject = async (req, res, next) => {
  try {
    const projectId = parseId(req.params.projectId, "projectId", res);
    if (!projectId) return;

    const { ok, value } = validate(updateProjectSchema, req.body, res);
    if (!ok) return;

    const userId = requireUserId(req, res);
    if (!userId) return;

    const result = await projectService.updateProject(projectId, value, userId);
    return respond(res, result);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/student/projects/:projectId (archives the project)
export const archiveProject = async (req, res, next) => {
  try {
    const projectId = parseId(req.params.projectId, "projectId", res);
    if (!projectId) return;

    const userId = requireUserId(req, res);
    if (!userId) return;

    const result = await projectService.archiveProject(projectId, userId);
    return respond(res, result);
  } catch (error) {
    next(error);
  }
};

// ─── Team Management ──────────────────────────────────────────────────────────

// GET /api/student/projects/:projectId/members
export const getTeamMembers = async (req, res, next) => {
  try {
    const projectId = parseId(req.params.projectId, "projectId", res);
    if (!projectId) return;

    const result = await projectService.getTeamDetails(projectId);
    return respond(res, result);
  } catch (error) {
    next(error);
  }
};

// POST /api/student/projects/:projectId/members
export const addMember = async (req, res, next) => {
  try {
    const projectId = parseId(req.params.projectId, "projectId", res);
    if (!projectId) return;

    const { ok, value } = validate(addMemberSchema, req.body, res);
    if (!ok) return;

    const userId = requireUserId(req, res);
    if (!userId) return;

    const result = await projectService.addTeamMember(projectId, value, userId);
    return respond(res, result, 201);
  } catch (error) {
    next(error);
  }
};

// PUT /api/student/projects/:projectId/members/:memberId
export const updateMemberRole = async (req, res, next) => {
  try {
    const projectId = parseId(req.params.projectId, "projectId", res);
    if (!projectId) return;

    const memberId = parseId(req.params.memberId, "memberId", res);
    if (!memberId) return;

    const { ok, value } = validate(updateMemberRoleSchema, req.body, res);
    if (!ok) return;

    const userId = requireUserId(req, res);
    if (!userId) return;

    const result = await projectService.updateMemberRole(
      projectId,
      memberId,
      value.role,
      userId
    );
    return respond(res, result);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/student/projects/:projectId/members/:memberId
export const removeMember = async (req, res, next) => {
  try {
    const projectId = parseId(req.params.projectId, "projectId", res);
    if (!projectId) return;

    const memberId = parseId(req.params.memberId, "memberId", res);
    if (!memberId) return;

    const userId = requireUserId(req, res);
    if (!userId) return;

    const result = await projectService.removeTeamMember(
      projectId,
      memberId,
      userId
    );
    return respond(res, result);
  } catch (error) {
    next(error);
  }
};

// ─── Milestones ───────────────────────────────────────────────────────────────

// GET /api/student/projects/:projectId/milestones
export const getMilestones = async (req, res, next) => {
  try {
    const projectId = parseId(req.params.projectId, "projectId", res);
    if (!projectId) return;

    const result = await projectService.getProjectMilestones(projectId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// POST /api/student/projects/:projectId/milestones
export const createMilestone = async (req, res, next) => {
  try {
    const projectId = parseId(req.params.projectId, "projectId", res);
    if (!projectId) return;

    const { ok, value } = validate(createMilestoneSchema, req.body, res);
    if (!ok) return;

    const userId = requireUserId(req, res);
    if (!userId) return;

    const result = await projectService.createMilestone(projectId, value, userId);
    return respond(res, result, 201);
  } catch (error) {
    next(error);
  }
};

// PUT /api/student/projects/:projectId/milestones/:milestoneId
export const updateMilestone = async (req, res, next) => {
  try {
    const projectId = parseId(req.params.projectId, "projectId", res);
    if (!projectId) return;

    const milestoneId = parseId(req.params.milestoneId, "milestoneId", res);
    if (!milestoneId) return;

    const { ok, value } = validate(updateMilestoneSchema, req.body, res);
    if (!ok) return;

    const userId = requireUserId(req, res);
    if (!userId) return;

    const result = await projectService.updateMilestone(
      projectId,
      milestoneId,
      value,
      userId
    );
    return respond(res, result);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/student/projects/:projectId/milestones/:milestoneId
export const deleteMilestone = async (req, res, next) => {
  try {
    const projectId = parseId(req.params.projectId, "projectId", res);
    if (!projectId) return;

    const milestoneId = parseId(req.params.milestoneId, "milestoneId", res);
    if (!milestoneId) return;

    const userId = requireUserId(req, res);
    if (!userId) return;

    const result = await projectService.deleteMilestone(
      projectId,
      milestoneId,
      userId
    );
    return respond(res, result);
  } catch (error) {
    next(error);
  }
};

// ─── Tasks ────────────────────────────────────────────────────────────────────

// GET /api/student/projects/:projectId/tasks
export const getTasks = async (req, res, next) => {
  try {
    const projectId = parseId(req.params.projectId, "projectId", res);
    if (!projectId) return;

    const result = await projectService.getProjectTasks(projectId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// POST /api/student/projects/:projectId/tasks
export const createTask = async (req, res, next) => {
  try {
    const projectId = parseId(req.params.projectId, "projectId", res);
    if (!projectId) return;

    const { ok, value } = validate(createTaskSchema, req.body, res);
    if (!ok) return;

    const userId = requireUserId(req, res);
    if (!userId) return;

    const result = await projectService.createTask(projectId, value, userId);
    return respond(res, result, 201);
  } catch (error) {
    next(error);
  }
};

// PUT /api/student/projects/:projectId/tasks/:taskId
export const updateTask = async (req, res, next) => {
  try {
    const projectId = parseId(req.params.projectId, "projectId", res);
    if (!projectId) return;

    const taskId = parseId(req.params.taskId, "taskId", res);
    if (!taskId) return;

    const { ok, value } = validate(updateTaskSchema, req.body, res);
    if (!ok) return;

    const userId = requireUserId(req, res);
    if (!userId) return;

    const result = await projectService.updateTaskStatus(
      projectId,
      taskId,
      value,
      userId
    );
    return respond(res, result);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/student/projects/:projectId/tasks/:taskId
export const deleteTask = async (req, res, next) => {
  try {
    const projectId = parseId(req.params.projectId, "projectId", res);
    if (!projectId) return;

    const taskId = parseId(req.params.taskId, "taskId", res);
    if (!taskId) return;

    const userId = requireUserId(req, res);
    if (!userId) return;

    const result = await projectService.deleteTask(projectId, taskId, userId);
    return respond(res, result);
  } catch (error) {
    next(error);
  }
};

// ─── Project Submissions ──────────────────────────────────────────────────────

// GET /api/student/projects/:projectId/submissions
export const getSubmissions = async (req, res, next) => {
  try {
    const projectId = parseId(req.params.projectId, "projectId", res);
    if (!projectId) return;

    const result = await projectService.getSubmissionHistory(projectId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// POST /api/student/projects/:projectId/submissions
export const submitProject = async (req, res, next) => {
  try {
    const projectId = parseId(req.params.projectId, "projectId", res);
    if (!projectId) return;

    const { ok, value } = validate(submitProjectSchema, req.body, res);
    if (!ok) return;

    const userId = requireUserId(req, res);
    if (!userId) return;

    const result = await projectService.submitProject(projectId, value, userId);
    return respond(res, result, 201);
  } catch (error) {
    next(error);
  }
};

// PUT /api/student/projects/:projectId/submissions/:submissionId
export const updateSubmission = async (req, res, next) => {
  try {
    const projectId = parseId(req.params.projectId, "projectId", res);
    if (!projectId) return;

    const submissionId = parseId(req.params.submissionId, "submissionId", res);
    if (!submissionId) return;

    const { ok, value } = validate(updateSubmissionSchema, req.body, res);
    if (!ok) return;

    const userId = requireUserId(req, res);
    if (!userId) return;

    const result = await projectService.updateSubmission(
      projectId,
      submissionId,
      value,
      userId
    );
    return respond(res, result);
  } catch (error) {
    next(error);
  }
};

// ─── File Attachments ─────────────────────────────────────────────────────────

// POST /api/student/projects/:projectId/files
export const uploadFiles = async (req, res, next) => {
  try {
    const projectId = parseId(req.params.projectId, "projectId", res);
    if (!projectId) return;

    const files = req.files || (req.file ? [req.file] : []);

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No files uploaded",
        message: "Please attach at least one file.",
      });
    }

    const userId = requireUserId(req, res);
    if (!userId) return;

    const result = await projectService.uploadProjectFiles(
      projectId,
      files,
      userId
    );
    return respond(res, result, 201);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/student/projects/:projectId/files/:fileId
export const deleteFile = async (req, res, next) => {
  try {
    const projectId = parseId(req.params.projectId, "projectId", res);
    if (!projectId) return;

    const fileId = parseId(req.params.fileId, "fileId", res);
    if (!fileId) return;

    const userId = requireUserId(req, res);
    if (!userId) return;

    const result = await projectService.deleteProjectFile(
      projectId,
      fileId,
      userId
    );
    return respond(res, result);
  } catch (error) {
    next(error);
  }
};

// ─── GitHub Repository ────────────────────────────────────────────────────────

// GET /api/student/projects/:projectId/repository
export const getRepository = async (req, res, next) => {
  try {
    const projectId = parseId(req.params.projectId, "projectId", res);
    if (!projectId) return;

    const result = await projectService.getProjectRepository(projectId);
    return respond(res, result);
  } catch (error) {
    next(error);
  }
};

// PUT /api/student/projects/:projectId/repository
export const updateRepository = async (req, res, next) => {
  try {
    const projectId = parseId(req.params.projectId, "projectId", res);
    if (!projectId) return;

    const { ok, value } = validate(updateRepositorySchema, req.body, res);
    if (!ok) return;

    const userId = requireUserId(req, res);
    if (!userId) return;

    const result = await projectService.updateProjectRepository(
      projectId,
      value,
      userId
    );
    return respond(res, result);
  } catch (error) {
    next(error);
  }
};

// ─── Mentor Reviews ───────────────────────────────────────────────────────────

// GET /api/student/projects/:projectId/reviews
export const getReviews = async (req, res, next) => {
  try {
    const projectId = parseId(req.params.projectId, "projectId", res);
    if (!projectId) return;

    const result = await projectService.getMentorReviews(projectId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// POST /api/student/projects/:projectId/reviews
export const createReview = async (req, res, next) => {
  try {
    const projectId = parseId(req.params.projectId, "projectId", res);
    if (!projectId) return;

    const { ok, value } = validate(createMentorReviewSchema, req.body, res);
    if (!ok) return;

    const userId = requireUserId(req, res);
    if (!userId) return;

    const result = await projectService.storeMentorReview(
      projectId,
      value,
      userId
    );
    return respond(res, result, 201);
  } catch (error) {
    next(error);
  }
};

// PUT /api/student/projects/:projectId/reviews/:reviewId
export const updateReview = async (req, res, next) => {
  try {
    const projectId = parseId(req.params.projectId, "projectId", res);
    if (!projectId) return;

    const reviewId = parseId(req.params.reviewId, "reviewId", res);
    if (!reviewId) return;

    const { ok, value } = validate(updateMentorReviewSchema, req.body, res);
    if (!ok) return;

    const userId = requireUserId(req, res);
    if (!userId) return;

    const result = await projectService.updateMentorReview(
      projectId,
      reviewId,
      value,
      userId
    );
    return respond(res, result);
  } catch (error) {
    next(error);
  }
};

// ─── Analytics ────────────────────────────────────────────────────────────────

// GET /api/student/projects/:projectId/analytics
export const getAnalytics = async (req, res, next) => {
  try {
    const projectId = parseId(req.params.projectId, "projectId", res);
    if (!projectId) return;

    const result = await projectService.getProjectAnalytics(projectId);
    return respond(res, result);
  } catch (error) {
    next(error);
  }
};
