<<<<<<< HEAD
// ─────────────────────────────────────────────────────────────────────────────
//  src/utils/projectHelpers.js
//  Helper utilities and custom error class for Projects module
// ─────────────────────────────────────────────────────────────────────────────

import { PROJECT_STATUS, SUBMISSION_STATUS } from "../constants/projectConstants.js";

/**
 * ApiError - Custom Application Error Class
 */
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = "ApiError";
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Sends a standardized success response
 * @param {object} res - Express response object
 * @param {any} data - Payload data
 * @param {string} message - Success message
 * @param {number} status - HTTP status code
 */
export const successResponse = (res, data = {}, message = "Success", status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

/**
 * Sends a standardized error response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 */
export const errorResponse = (res, message = "Error occurred", status = 400) => {
  return res.status(status).json({
    success: false,
    message,
  });
};

/**
 * Checks if a given deadline has passed
 * @param {Date|string} deadlineDate
 * @returns {boolean}
 */
export const isDeadlinePassed = (deadlineDate) => {
  if (!deadlineDate) return false;
  const deadline = new Date(deadlineDate);
  if (isNaN(deadline.getTime())) return false;
  return new Date() > deadline;
};

/**
 * Computes project submission status based on milestones and final submission
 * @param {Array} milestones
 * @param {object|null} finalSubmission
 * @returns {string}
 */
export const calculateSubmissionStatus = (milestones = [], finalSubmission = null) => {
  if (finalSubmission) {
    return finalSubmission.status || PROJECT_STATUS.SUBMITTED;
  }
  if (!milestones || milestones.length === 0) {
    return PROJECT_STATUS.PENDING;
  }

  const completedCount = milestones.filter(
    (m) => m.status === SUBMISSION_STATUS.APPROVED || m.status === "COMPLETED"
  ).length;

  if (completedCount === milestones.length) {
    return PROJECT_STATUS.SUBMITTED;
  }
  if (completedCount > 0) {
    return PROJECT_STATUS.IN_PROGRESS;
  }

  return PROJECT_STATUS.PENDING;
};

/**
 * Extracts GitHub owner/repository from a GitHub URL
 * @param {string} url
 * @returns {{ owner: string, repo: string } | null}
 */
export const extractGithubRepo = (url) => {
  if (!url || typeof url !== "string") return null;
  const match = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)/);
  if (match) {
    return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
  }
  return null;
};

/**
 * Formats project output object for consistent client response
 * @param {object} project - Sequelize instance or plain object
 * @param {Array} milestones
 * @param {Array} submissions
 * @returns {object}
 */
export const formatProject = (project, milestones = [], submissions = []) => {
  const plainProject = project.get ? project.get({ plain: true }) : project;
  const isExpired = isDeadlinePassed(plainProject.deadline);

  return {
    id: plainProject.id,
    title: plainProject.title,
    description: plainProject.description,
    studentId: plainProject.studentId || plainProject.student_id,
    repositoryUrl: plainProject.repositoryUrl || plainProject.repository_url,
    deploymentUrl: plainProject.deploymentUrl || plainProject.deployment_url,
    reportUrl: plainProject.reportUrl || plainProject.report_url,
    status: plainProject.status,
    totalScore: plainProject.totalScore || plainProject.total_score || null,
    feedback: plainProject.feedback || null,
    rubricScores: plainProject.rubricScores || plainProject.rubric_scores || null,
    deadline: plainProject.deadline,
    isDeadlinePassed: isExpired,
    milestones: milestones.map((m) => {
      const pm = m.get ? m.get({ plain: true }) : m;
      return {
        id: pm.id,
        title: pm.title,
        description: pm.description,
        deadline: pm.deadline,
        status: pm.status,
        weightage: pm.weightage,
        isDeadlinePassed: isDeadlinePassed(pm.deadline),
      };
    }),
    submissions: submissions.map((s) => {
      const ps = s.get ? s.get({ plain: true }) : s;
      return {
        id: ps.id,
        milestoneId: ps.milestoneId || ps.milestone_id || null,
        submissionType: ps.submissionType || ps.submission_type,
        githubUrl: ps.githubUrl || ps.github_url,
        deploymentUrl: ps.deploymentUrl || ps.deployment_url,
        progressNotes: ps.progressNotes || ps.progress_notes,
        reportUrl: ps.reportUrl || ps.report_url,
        status: ps.status,
        submittedAt: ps.submittedAt || ps.submitted_at,
        feedback: ps.feedback || null,
        rubricScores: ps.rubricScores || ps.rubric_scores || null,
      };
    }),
    createdAt: plainProject.createdAt || plainProject.created_at,
    updatedAt: plainProject.updatedAt || plainProject.updated_at,
=======
/**
 * Helper to calculate overall project progress percentage based on tasks and milestones.
 * @param {Array} milestones 
 * @param {Array} tasks 
 * @returns {number} Progress percentage (0-100)
 */
export const calculateProjectProgress = (milestones = [], tasks = []) => {
  if (milestones.length === 0 && tasks.length === 0) {
    return 0;
  }

  let milestoneWeight = 0.4;
  let taskWeight = 0.6;

  if (milestones.length === 0) {
    milestoneWeight = 0;
    taskWeight = 1.0;
  } else if (tasks.length === 0) {
    milestoneWeight = 1.0;
    taskWeight = 0;
  }

  const completedMilestones = milestones.filter(
    (m) => m.status === "COMPLETED"
  ).length;
  const milestoneScore = milestones.length > 0 ? (completedMilestones / milestones.length) * 100 : 0;

  const completedTasks = tasks.filter(
    (t) => t.status === "COMPLETED"
  ).length;
  const taskScore = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  const overallProgress = Math.round(
    milestoneScore * milestoneWeight + taskScore * taskWeight
  );

  return Math.min(100, Math.max(0, overallProgress));
};

/**
 * Validates a GitHub repository URL string.
 * @param {string} url 
 * @returns {boolean}
 */
export const isValidGitHubUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  const githubRegex = /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(\/)?$/;
  return githubRegex.test(url.trim());
};

/**
 * Generates structured analytical insights for a project.
 * @param {Object} projectData 
 * @returns {Object}
 */
export const generateProjectInsights = (projectData) => {
  const { milestones = [], tasks = [], submissions = [], reviews = [] } = projectData;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const pendingTasks = tasks.filter((t) => t.status === "TODO").length;
  const blockedTasks = tasks.filter((t) => t.status === "BLOCKED").length;

  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter((m) => m.status === "COMPLETED").length;

  const latestReview = reviews.length > 0 ? reviews[reviews.length - 1] : null;

  return {
    completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    taskBreakdown: {
      total: totalTasks,
      completed: completedTasks,
      inProgress: inProgressTasks,
      pending: pendingTasks,
      blocked: blockedTasks,
    },
    milestoneBreakdown: {
      total: totalMilestones,
      completed: completedMilestones,
      pending: totalMilestones - completedMilestones,
    },
    submissionCount: submissions.length,
    latestEvaluationScore: latestReview ? latestReview.score : null,
    overallHealth: blockedTasks > 2 ? "NEEDS_ATTENTION" : completedTasks / (totalTasks || 1) >= 0.75 ? "EXCELLENT" : "ON_TRACK",
>>>>>>> b58e0407 (feat: projects backend implementation)
  };
};
