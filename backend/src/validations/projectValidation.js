// ─────────────────────────────────────────────────────────────────────────────
//  src/validations/projectValidation.js
//  Combined validators and Joi schemas for Project Backend Module
// ─────────────────────────────────────────────────────────────────────────────

import Joi from "joi";
import { ApiError } from "../utils/projectHelpers.js";
import {
  PROJECT_STATUS,
  PROJECT_ROLE,
  MILESTONE_STATUS,
  TASK_STATUS,
  TASK_PRIORITY,
  SUBMISSION_STATUS,
} from "../constants/projectConstants.js";

// File and validation limits
export const FILE_CONSTRAINTS = {
  ALLOWED_MIME: "application/pdf",
  ALLOWED_EXT: ".pdf",
  MAX_REPORT_SIZE: 20 * 1024 * 1024, // 20MB
};

export const VALIDATION_LIMITS = {
  MAX_PROGRESS_NOTES_LENGTH: 1000,
};

export const GITHUB_URL_PREFIX = "https://github.com/";
export const DEPLOYMENT_URL_PREFIX = "https://";

const githubUrlPattern = /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(\/)?$/;

export const createProjectSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).required(),
  description: Joi.string().trim().allow("", null),
  category: Joi.string().trim().max(100).allow("", null),
  tags: Joi.array().items(Joi.string().trim()).default([]),
  githubRepoUrl: Joi.string().trim().regex(githubUrlPattern).allow("", null).messages({
    "string.pattern.base": "Invalid GitHub repository URL format",
  }),
  startDate: Joi.date().iso().allow(null),
  endDate: Joi.date().iso().min(Joi.ref("startDate")).allow(null),
  teamMembers: Joi.array()
    .items(
      Joi.object({
        studentId: Joi.alternatives().try(Joi.number().integer(), Joi.string()).required(),
        role: Joi.string()
          .valid(...Object.values(PROJECT_ROLE))
          .default(PROJECT_ROLE.MEMBER),
      })
    )
    .default([]),
});

export const updateProjectSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255),
  description: Joi.string().trim().allow("", null),
  category: Joi.string().trim().max(100).allow("", null),
  tags: Joi.array().items(Joi.string().trim()),
  status: Joi.string().valid(...Object.values(PROJECT_STATUS)),
  githubRepoUrl: Joi.string().trim().regex(githubUrlPattern).allow("", null).messages({
    "string.pattern.base": "Invalid GitHub repository URL format",
  }),
  startDate: Joi.date().iso().allow(null),
  endDate: Joi.date().iso().allow(null),
});

export const addMemberSchema = Joi.object({
  studentId: Joi.alternatives().try(Joi.number().integer(), Joi.string()).required(),
  role: Joi.string()
    .valid(...Object.values(PROJECT_ROLE))
    .default(PROJECT_ROLE.MEMBER),
});

export const updateMemberRoleSchema = Joi.object({
  role: Joi.string()
    .valid(...Object.values(PROJECT_ROLE))
    .required(),
});

export const createMilestoneSchema = Joi.object({
  title: Joi.string().trim().min(2).max(255).required(),
  description: Joi.string().trim().allow("", null),
  dueDate: Joi.date().iso().allow(null),
  targetDate: Joi.date().iso().allow(null),
});

export const updateMilestoneSchema = Joi.object({
  title: Joi.string().trim().min(2).max(255),
  description: Joi.string().trim().allow("", null),
  dueDate: Joi.date().iso().allow(null),
  targetDate: Joi.date().iso().allow(null),
  status: Joi.string().valid(...Object.values(MILESTONE_STATUS)),
});

export const createTaskSchema = Joi.object({
  milestoneId: Joi.alternatives().try(Joi.number().integer(), Joi.string()).allow(null),
  title: Joi.string().trim().min(2).max(255).required(),
  description: Joi.string().trim().allow("", null),
  assignedTo: Joi.alternatives().try(Joi.number().integer(), Joi.string()).allow(null),
  priority: Joi.string()
    .valid(...Object.values(TASK_PRIORITY))
    .default(TASK_PRIORITY.MEDIUM),
  dueDate: Joi.date().iso().allow(null),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(2).max(255),
  description: Joi.string().trim().allow("", null),
  assignedTo: Joi.alternatives().try(Joi.number().integer(), Joi.string()).allow(null),
  status: Joi.string().valid(...Object.values(TASK_STATUS)),
  priority: Joi.string().valid(...Object.values(TASK_PRIORITY)),
  dueDate: Joi.date().iso().allow(null),
});

export const submitProjectSchema = Joi.object({
  repositoryUrl: Joi.string().trim().regex(githubUrlPattern).required().messages({
    "string.pattern.base": "Invalid GitHub repository URL format",
  }),
  branchName: Joi.string().trim().default("main"),
  submissionNotes: Joi.string().trim().allow("", null),
  demoUrl: Joi.string().uri().allow("", null),
});

export const updateSubmissionSchema = Joi.object({
  repositoryUrl: Joi.string().trim().regex(githubUrlPattern).messages({
    "string.pattern.base": "Invalid GitHub repository URL format",
  }),
  branchName: Joi.string().trim(),
  submissionNotes: Joi.string().trim().allow("", null),
  demoUrl: Joi.string().uri().allow("", null),
  status: Joi.string().valid(...Object.values(SUBMISSION_STATUS)),
});

export const updateRepositorySchema = Joi.object({
  repoUrl: Joi.string().trim().regex(githubUrlPattern).required().messages({
    "string.pattern.base": "Invalid GitHub repository URL format",
  }),
  repoName: Joi.string().trim().allow("", null),
  branch: Joi.string().trim().default("main"),
  owner: Joi.string().trim().allow("", null),
  isPrivate: Joi.boolean().default(false),
  openIssues: Joi.number().integer().min(0).default(0),
  stars: Joi.number().integer().min(0).default(0),
  forks: Joi.number().integer().min(0).default(0),
});

export const createMentorReviewSchema = Joi.object({
  submissionId: Joi.alternatives().try(Joi.number().integer(), Joi.string()).allow(null),
  feedback: Joi.string().trim().min(2).required(),
  score: Joi.number().min(0).max(100).allow(null),
  status: Joi.string().default("COMPLETED"),
});

export const updateMentorReviewSchema = Joi.object({
  feedback: Joi.string().trim().min(2),
  score: Joi.number().min(0).max(100).allow(null),
  status: Joi.string(),
});

// ------------------------- Imperative validators ---------------------------

export const validateGithubUrl = (url) => {
  if (!url || typeof url !== "string" || !url.trim()) {
    throw new ApiError(400, "GitHub URL is required");
  }

  const sanitized = url.trim();

  if (!sanitized.startsWith(GITHUB_URL_PREFIX)) {
    throw new ApiError(400, `Invalid GitHub URL. Must begin with '${GITHUB_URL_PREFIX}'`);
  }

  try {
    const parsed = new globalThis.URL(sanitized);
    if (parsed.hostname !== "github.com") {
      throw new ApiError(400, "GitHub URL domain must be github.com");
    }
    const pathSegments = parsed.pathname.split("/").filter(Boolean);
    if (pathSegments.length < 2) {
      throw new ApiError(400, "Invalid GitHub URL format. Expected github.com/owner/repository");
    }
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(400, "Invalid GitHub URL format");
  }

  return sanitized;
};

export const validateDeploymentUrl = (url, required = false) => {
  if (!url || typeof url !== "string" || !url.trim()) {
    if (required) {
      throw new ApiError(400, "Deployment URL is required");
    }
    return null;
  }

  const sanitized = url.trim();

  if (!sanitized.startsWith(DEPLOYMENT_URL_PREFIX)) {
    throw new ApiError(400, `Invalid Deployment URL. Must begin with '${DEPLOYMENT_URL_PREFIX}'`);
  }

  try {
    const parsed = new globalThis.URL(sanitized);
    if (parsed.protocol !== "https:") {
      throw new ApiError(400, "Deployment URL must use HTTPS protocol");
    }
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(400, "Invalid Deployment URL format");
  }

  return sanitized;
};

export const validatePdfReport = (file, required = false) => {
  if (!file) {
    if (required) {
      throw new ApiError(400, "PDF report file is required");
    }
    return null;
  }

  const isPdfMime = file.mimetype === FILE_CONSTRAINTS.ALLOWED_MIME;
  const isPdfExt = file.originalname && file.originalname.toLowerCase().endsWith(FILE_CONSTRAINTS.ALLOWED_EXT);

  if (!isPdfMime && !isPdfExt) {
    throw new ApiError(400, "Invalid file type. Only PDF reports are allowed");
  }

  if (file.size > FILE_CONSTRAINTS.MAX_REPORT_SIZE) {
    throw new ApiError(400, "PDF report file size exceeds maximum limit of 20MB");
  }

  return file;
};

export const validateProgressNotes = (notes, required = false) => {
  if (!notes || typeof notes !== "string" || !notes.trim()) {
    if (required) {
      throw new ApiError(400, "Progress notes are required");
    }
    return null;
  }

  const sanitized = notes.trim();

  if (sanitized.length > VALIDATION_LIMITS.MAX_PROGRESS_NOTES_LENGTH) {
    throw new ApiError(400, `Progress notes must not exceed ${VALIDATION_LIMITS.MAX_PROGRESS_NOTES_LENGTH} characters`);
  }

  return sanitized;
};

export const validateDeadline = (deadlineDate) => {
  if (!deadlineDate) return;

  const deadline = new Date(deadlineDate);
  const now = new Date();

  if (isNaN(deadline.getTime())) {
    throw new ApiError(400, "Invalid project or milestone deadline date");
  }

  if (now > deadline) {
    throw new ApiError(400, "Deadline exceeded");
  }
};

export default {};
