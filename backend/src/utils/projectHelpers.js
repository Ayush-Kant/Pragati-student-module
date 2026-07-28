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
  };
};
