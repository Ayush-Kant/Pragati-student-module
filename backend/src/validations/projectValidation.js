import Joi from "joi";
import {
  PROJECT_STATUS,
  PROJECT_ROLE,
  MILESTONE_STATUS,
  TASK_STATUS,
  TASK_PRIORITY,
  SUBMISSION_STATUS,
} from "../constants/projectConstants.js";

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

export const addMemberSchema = Joi.object({
  studentId: Joi.alternatives().try(Joi.number().integer(), Joi.string()).required(),
  role: Joi.string()
    .valid(...Object.values(PROJECT_ROLE))
    .default(PROJECT_ROLE.MEMBER),
});
