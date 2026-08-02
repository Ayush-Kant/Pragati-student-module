// ─────────────────────────────────────────────────────────────────────────────
//  src/services/projectService.js
//  Service Layer - All Business Logic for Projects Backend Module
// ─────────────────────────────────────────────────────────────────────────────

import sequelize from "../../config/sequelize.js";
import {
  StudentProject,
  ProjectMilestone,
  ActivitySubmission,
} from "../models/projectModel.js";
import {
  validateGithubUrl,
  validateDeploymentUrl,
  validatePdfReport,
  validateProgressNotes,
  validateDeadline,
} from "../validations/projectValidation.js";
import { uploadReport } from "../config/aws.js";
import {
  ApiError,
  formatProject,
} from "../utils/projectHelpers.js";
import {
  PROJECT_STATUS,
  MILESTONE_STATUS,
  SUBMISSION_STATUS,
  SUBMISSION_TYPE,
} from "../constants/projectConstants.js";

/**
 * ProjectService Class
 */
class ProjectService {
  /**
   * Fetches full project details including milestones, submissions, rubric, and status
   * @param {number|string} studentId - Logged in student ID from JWT
   * @param {number|string} projectId - Target project ID
   * @returns {Promise<object>} Formatted project details payload
   */
  async fetchProjectDetails(studentId, projectId) {
    const numericProjectId = Number(projectId);
    const numericStudentId = Number(studentId);

    if (isNaN(numericProjectId)) {
      throw new ApiError(400, "Invalid project ID format");
    }

    const project = await StudentProject.findOne({
      where: { id: numericProjectId },
      include: [
        {
          model: ProjectMilestone,
          as: "milestones",
        },
        {
          model: ActivitySubmission,
          as: "submissions",
        },
      ],
      order: [
        [{ model: ProjectMilestone, as: "milestones" }, "id", "ASC"],
        [{ model: ActivitySubmission, as: "submissions" }, "submittedAt", "DESC"],
      ],
    });

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    // Ownership Verification
    if (Number(project.studentId) !== numericStudentId) {
      throw new ApiError(403, "Access denied: You do not own this project");
    }

    const milestones = project.milestones || [];
    const submissions = project.submissions || [];

    return formatProject(project, milestones, submissions);
  }

  /**
   * Submits a milestone entry for a project
   * @param {number|string} studentId - Logged in student ID from JWT
   * @param {number|string} projectId - Target project ID
   * @param {number|string} milestoneId - Target milestone ID
   * @param {object} data - Payload body containing githubUrl, deploymentUrl, progressNotes
   * @returns {Promise<object>} Created submission record details
   */
  async createMilestoneSubmission(studentId, projectId, milestoneId, data = {}) {
    const numericStudentId = Number(studentId);
    const numericProjectId = Number(projectId);
    const numericMilestoneId = Number(milestoneId);

    if (isNaN(numericProjectId) || isNaN(numericMilestoneId)) {
      throw new ApiError(400, "Invalid project or milestone ID format");
    }

    // 1. Validate GitHub URL
    const validGithubUrl = validateGithubUrl(data.githubUrl);

    // 2. Validate Deployment URL
    const validDeploymentUrl = validateDeploymentUrl(data.deploymentUrl, false);

    // 3. Validate Progress Notes
    const validProgressNotes = validateProgressNotes(data.progressNotes, false);

    // 4. Check Project Exists & Student Ownership
    const project = await StudentProject.findOne({
      where: { id: numericProjectId },
    });

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    if (Number(project.studentId) !== numericStudentId) {
      throw new ApiError(403, "Access denied: You do not own this project");
    }

    // 5. Check Milestone Exists & belongs to Project
    const milestone = await ProjectMilestone.findOne({
      where: { id: numericMilestoneId, projectId: numericProjectId },
    });

    if (!milestone) {
      throw new ApiError(404, "Milestone not found for this project");
    }

    // 6. Validate Deadline
    this.validateSubmissionDeadline(milestone.deadline);

    // 7. Atomic Database Transaction
    const transaction = await sequelize.transaction();

    try {
      // Create Activity Submission Record
      const submission = await ActivitySubmission.create(
        {
          projectId: numericProjectId,
          milestoneId: numericMilestoneId,
          studentId: numericStudentId,
          githubUrl: validGithubUrl,
          deploymentUrl: validDeploymentUrl,
          progressNotes: validProgressNotes,
          submissionType: SUBMISSION_TYPE.MILESTONE,
          status: SUBMISSION_STATUS.SUBMITTED,
          submittedAt: new Date(),
        },
        { transaction }
      );

      // Update Milestone Status to SUBMITTED
      await milestone.update(
        { status: MILESTONE_STATUS.SUBMITTED },
        { transaction }
      );

      // Update Project Status to IN_PROGRESS if PENDING
      if (project.status === PROJECT_STATUS.PENDING) {
        await project.update(
          { status: PROJECT_STATUS.IN_PROGRESS },
          { transaction }
        );
      }

      await transaction.commit();

      return {
        submissionId: submission.id,
        projectId: submission.projectId,
        milestoneId: submission.milestoneId,
        githubUrl: submission.githubUrl,
        deploymentUrl: submission.deploymentUrl,
        progressNotes: submission.progressNotes,
        status: submission.status,
        submittedAt: submission.submittedAt,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Helper to handle S3 PDF report upload
   * @param {object} file - Express/Multer file object
   * @param {number|string} studentId
   * @param {number|string} projectId
   * @returns {Promise<string|null>} S3 file URL or null
   */
  async uploadProjectReport(file, studentId, projectId) {
    if (!file) return null;
    validatePdfReport(file, false);
    const result = await uploadReport(file, studentId, projectId);
    return result.url;
  }

  /**
   * Submits final project with GitHub repository, deployment URL, and optional PDF report
   * @param {number|string} studentId - Logged in student ID from JWT
   * @param {number|string} projectId - Target project ID
   * @param {object} data - Body fields (githubUrl, deploymentUrl, progressNotes)
   * @param {object} file - Express/Multer file object (optional PDF)
   * @returns {Promise<object>} Created final submission response
   */
  async createFinalSubmission(studentId, projectId, data = {}, file = null) {
    const numericStudentId = Number(studentId);
    const numericProjectId = Number(projectId);

    if (isNaN(numericProjectId)) {
      throw new ApiError(400, "Invalid project ID format");
    }

    // 1. Validate GitHub URL
    const validGithubUrl = validateGithubUrl(data.githubUrl);

    // 2. Validate Deployment URL
    const validDeploymentUrl = validateDeploymentUrl(data.deploymentUrl, false);

    // 3. Validate Progress Notes
    const validProgressNotes = validateProgressNotes(data.progressNotes, false);

    // 4. Validate PDF Report if attached
    if (file) {
      validatePdfReport(file, false);
    }

    // 5. Check Project Exists & Student Ownership
    const project = await StudentProject.findOne({
      where: { id: numericProjectId },
    });

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    if (Number(project.studentId) !== numericStudentId) {
      throw new ApiError(403, "Access denied: You do not own this project");
    }

    // 6. Validate Project Deadline
    this.validateSubmissionDeadline(project.deadline);

    // 7. Upload PDF report to S3 if present
    let reportUrl = null;
    if (file) {
      reportUrl = await this.uploadProjectReport(file, numericStudentId, numericProjectId);
    }

    // 8. Atomic Database Transaction
    const transaction = await sequelize.transaction();

    try {
      // Create Activity Submission Record for Final Project
      const submission = await ActivitySubmission.create(
        {
          projectId: numericProjectId,
          milestoneId: null,
          studentId: numericStudentId,
          githubUrl: validGithubUrl,
          deploymentUrl: validDeploymentUrl,
          progressNotes: validProgressNotes,
          reportUrl,
          submissionType: SUBMISSION_TYPE.FINAL,
          status: SUBMISSION_STATUS.SUBMITTED,
          submittedAt: new Date(),
        },
        { transaction }
      );

      // Update Student Project record with URLs and set status to SUBMITTED
      await project.update(
        {
          repositoryUrl: validGithubUrl,
          deploymentUrl: validDeploymentUrl || project.deploymentUrl,
          reportUrl: reportUrl || project.reportUrl,
          status: PROJECT_STATUS.SUBMITTED,
        },
        { transaction }
      );

      await transaction.commit();

      return {
        submissionId: submission.id,
        projectId: submission.projectId,
        githubUrl: submission.githubUrl,
        deploymentUrl: submission.deploymentUrl,
        reportUrl: submission.reportUrl,
        progressNotes: submission.progressNotes,
        status: submission.status,
        submittedAt: submission.submittedAt,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Validates whether submission deadline has passed
   * @param {Date|string} deadline
   */
  validateSubmissionDeadline(deadline) {
    validateDeadline(deadline);
  }
}

export default new ProjectService();
