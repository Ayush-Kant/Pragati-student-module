import sequelize from "../../config/sequelize.js";
import Project from "../models/projectModel.js";
import Milestone from "../models/milestoneModel.js";
import Task from "../models/taskModel.js";
import { ProjectSubmission } from "../models/submissionModel.js";
import ProjectFile from "../models/attachmentModel.js";
import MentorReview from "../models/mentorReviewModel.js";
import ProjectMember from "../models/projectMemberModel.js";
import ProjectActivity from "../models/activityLogModel.js";
import ProjectRepository from "../models/repositoryModel.js";
import {
  calculateProjectProgress,
  generateProjectInsights,
  calculateTeamStats,
} from "../utils/projectHelpers.js";
import {
  ACTIVITY_TYPE,
  PROJECT_ROLE,
  MILESTONE_STATUS,
  TASK_STATUS,
  PROJECT_STATUS,
  MESSAGES,
} from "../constants/projectConstants.js";
import fs from "fs";

/**
 * Log activity for a project
 */
export const logActivity = async (
  projectId,
  userId,
  activityType,
  description,
  metadata = {}
) => {
  try {
    return await ProjectActivity.create({
      projectId,
      userId,
      activityType,
      description,
      metadata,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[logActivity] Failed to record activity (${activityType}):`, error.message);
    }
    return null;
  }
};

/**
 * Recalculates and updates project progress percentage based on completed milestones and tasks.
 */
export const updateProjectProgress = async (projectId) => {
  try {
    const milestones = await Milestone.findAll({ where: { projectId } });
    const tasks = await Task.findAll({ where: { projectId } });
    const progress = calculateProjectProgress(milestones, tasks);

    await Project.update({ progress }, { where: { id: projectId } });
    return progress;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[updateProjectProgress] Failed to update progress for project ${projectId}:`, error.message);
    }
    return 0;
  }
};

/**
 * Retrieve all projects with optional filtering and pagination
 */
export const getAllProjects = async (filters = {}, pagination = {}) => {
  const { category, status, search } = filters;
  const page = parseInt(pagination.page, 10) || 1;
  const pageSize = parseInt(pagination.pageSize, 10) || 10;
  const offset = (page - 1) * pageSize;

  const whereClause = {};

  if (category) {
    whereClause.category = category;
  }
  if (status) {
    whereClause.status = status;
  }

  const { count, rows } = await Project.findAndCountAll({
    where: whereClause,
    include: [
      { model: ProjectMember, as: "members" },
      { model: Milestone, as: "milestones" },
      { model: Task, as: "tasks" },
      { model: ProjectRepository, as: "repository" },
    ],
    distinct: true,
    limit: pageSize,
    offset,
    order: [["updatedAt", "DESC"]],
  });

  return {
    success: true,
    data: rows,
    pagination: {
      total: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    },
  };
};

/**
 * Retrieve detailed project details by project ID
 */
export const getProjectById = async (projectId) => {
  const project = await Project.findByPk(projectId, {
    include: [
      { model: ProjectMember, as: "members" },
      { model: Milestone, as: "milestones" },
      { model: Task, as: "tasks" },
      { model: ProjectSubmission, as: "submissions" },
      { model: ProjectFile, as: "files" },
      { model: MentorReview, as: "reviews" },
      { model: ProjectActivity, as: "activities" },
      { model: ProjectRepository, as: "repository" },
    ],
  });

  if (!project) {
    return { success: false, statusCode: 404, message: MESSAGES.PROJECT_NOT_FOUND };
  }

  return { success: true, data: project };
};

/**
 * Create a new project along with team members and activity log
 */
export const createProject = async (projectData, userId) => {
  const {
    title,
    description,
    category,
    tags,
    githubRepoUrl,
    startDate,
    endDate,
    teamMembers = [],
  } = projectData;

  const createdProjectId = await sequelize.transaction(async (transaction) => {
    const newProject = await Project.create(
      {
        title,
        description,
        category,
        tags,
        githubRepoUrl,
        startDate,
        endDate,
        createdById: userId,
        status: PROJECT_STATUS.IN_PROGRESS,
        progress: 0,
      },
      { transaction }
    );

    // Always add creator as LEADER
    await ProjectMember.create(
      {
        projectId: newProject.id,
        studentId: userId,
        role: PROJECT_ROLE.LEADER,
      },
      { transaction }
    );

    // Add additional team members
    for (const member of teamMembers) {
      if (Number(member.studentId) !== Number(userId)) {
        await ProjectMember.create(
          {
            projectId: newProject.id,
            studentId: member.studentId,
            role: member.role || PROJECT_ROLE.MEMBER,
          },
          { transaction }
        );
      }
    }

    if (githubRepoUrl) {
      await ProjectRepository.create(
        {
          projectId: newProject.id,
          repoUrl: githubRepoUrl,
          branch: "main",
        },
        { transaction }
      );
    }

    return newProject.id;
  });

  await logActivity(
    createdProjectId,
    userId,
    ACTIVITY_TYPE.PROJECT_CREATED,
    `Project '${title}' was created.`
  );

  return getProjectById(createdProjectId);
};

/**
 * Update project details
 */
export const updateProject = async (projectId, updateData, userId) => {
  const project = await Project.findByPk(projectId);
  if (!project) {
    return { success: false, statusCode: 404, message: MESSAGES.PROJECT_NOT_FOUND };
  }

  await project.update(updateData);

  if (updateData.githubRepoUrl) {
    const existingRepo = await ProjectRepository.findOne({ where: { projectId } });
    if (existingRepo) {
      await existingRepo.update({ repoUrl: updateData.githubRepoUrl });
    } else {
      await ProjectRepository.create({
        projectId,
        repoUrl: updateData.githubRepoUrl,
        branch: "main",
      });
    }
  }

  await logActivity(
    projectId,
    userId,
    ACTIVITY_TYPE.PROJECT_UPDATED,
    `Project details updated.`
  );

  return getProjectById(projectId);
};

/**
 * Archive project
 */
export const archiveProject = async (projectId, userId) => {
  const project = await Project.findByPk(projectId);
  if (!project) {
    return { success: false, statusCode: 404, message: MESSAGES.PROJECT_NOT_FOUND };
  }

  await project.update({ status: PROJECT_STATUS.ARCHIVED });

  await logActivity(
    projectId,
    userId,
    ACTIVITY_TYPE.PROJECT_ARCHIVED,
    `Project was archived.`
  );

  return { success: true, message: MESSAGES.PROJECT_ARCHIVED, data: project };
};

/**
 * Delete project and associated resources
 */
export const deleteProject = async (projectId, userId) => {
  const project = await Project.findByPk(projectId);
  if (!project) {
    return { success: false, statusCode: 404, message: MESSAGES.PROJECT_NOT_FOUND };
  }

  await project.destroy();
  return { success: true, message: MESSAGES.PROJECT_DELETED };
};

// ─── Team Management ──────────────────────────────────────────────────────────

/**
 * Retrieve team members and roles for a project
 */
export const getTeamDetails = async (projectId) => {
  const project = await Project.findByPk(projectId);
  if (!project) {
    return { success: false, statusCode: 404, message: MESSAGES.PROJECT_NOT_FOUND };
  }

  const members = await ProjectMember.findAll({
    where: { projectId },
    order: [["createdAt", "ASC"]],
  });

  return { success: true, data: members };
};

/**
 * Add team member to project
 */
export const addTeamMember = async (projectId, memberData, userId) => {
  const project = await Project.findByPk(projectId);
  if (!project) {
    return { success: false, statusCode: 404, message: MESSAGES.PROJECT_NOT_FOUND };
  }

  const existingMember = await ProjectMember.findOne({
    where: { projectId, studentId: memberData.studentId },
  });

  if (existingMember) {
    return {
      success: false,
      statusCode: 400,
      message: "Student is already a member of this project.",
    };
  }

  const member = await ProjectMember.create({
    projectId,
    studentId: memberData.studentId,
    role: memberData.role || PROJECT_ROLE.MEMBER,
  });

  await logActivity(
    projectId,
    userId,
    ACTIVITY_TYPE.MEMBER_ADDED,
    `Member ${memberData.studentId} added as ${member.role}.`
  );

  return { success: true, data: member, message: MESSAGES.MEMBER_ADDED };
};

/**
 * Remove team member from project
 */
export const removeTeamMember = async (projectId, memberId, userId) => {
  const member = await ProjectMember.findOne({
    where: { id: memberId, projectId },
  });

  if (!member) {
    return { success: false, statusCode: 404, message: MESSAGES.MEMBER_NOT_FOUND };
  }

  await member.destroy();

  await logActivity(
    projectId,
    userId,
    ACTIVITY_TYPE.MEMBER_REMOVED,
    `Member ${member.studentId} removed from project.`
  );

  return { success: true, message: MESSAGES.MEMBER_REMOVED };
};

/**
 * Update member role
 */
export const updateMemberRole = async (projectId, memberId, role, userId) => {
  const member = await ProjectMember.findOne({
    where: { id: memberId, projectId },
  });

  if (!member) {
    return { success: false, statusCode: 404, message: MESSAGES.MEMBER_NOT_FOUND };
  }

  await member.update({ role });

  await logActivity(
    projectId,
    userId,
    ACTIVITY_TYPE.MEMBER_UPDATED,
    `Member ${member.studentId} role updated to ${role}.`
  );

  return { success: true, data: member, message: MESSAGES.MEMBER_UPDATED };
};

// ─── Milestones & Tasks ───────────────────────────────────────────────────────

/**
 * Retrieve milestones for a project
 */
export const getProjectMilestones = async (projectId) => {
  const milestones = await Milestone.findAll({
    where: { projectId },
    include: [{ model: Task, as: "tasks" }],
    order: [["createdAt", "ASC"]],
  });

  return { success: true, data: milestones };
};

/**
 * Create milestone for a project
 */
export const createMilestone = async (projectId, milestoneData, userId) => {
  const project = await Project.findByPk(projectId);
  if (!project) {
    return { success: false, statusCode: 404, message: MESSAGES.PROJECT_NOT_FOUND };
  }

  const milestone = await Milestone.create({
    projectId,
    title: milestoneData.title,
    description: milestoneData.description,
    dueDate: milestoneData.dueDate,
    targetDate: milestoneData.targetDate,
    status: MILESTONE_STATUS.PENDING,
  });

  await logActivity(
    projectId,
    userId,
    ACTIVITY_TYPE.MILESTONE_CREATED,
    `Milestone '${milestone.title}' was created.`
  );

  await updateProjectProgress(projectId);

  return { success: true, data: milestone, message: MESSAGES.MILESTONE_CREATED };
};

/**
 * Update milestone details or status
 */
export const updateMilestone = async (
  projectId,
  milestoneId,
  milestoneData,
  userId
) => {
  const milestone = await Milestone.findOne({
    where: { id: milestoneId, projectId },
  });
  if (!milestone) {
    return { success: false, statusCode: 404, message: MESSAGES.MILESTONE_NOT_FOUND };
  }

  const completedAt =
    milestoneData.status === MILESTONE_STATUS.COMPLETED
      ? new Date()
      : milestone.completedAt;

  await milestone.update({
    ...milestoneData,
    completedAt,
  });

  await logActivity(
    projectId,
    userId,
    ACTIVITY_TYPE.MILESTONE_UPDATED,
    `Milestone '${milestone.title}' was updated.`
  );

  await updateProjectProgress(projectId);

  return { success: true, data: milestone, message: MESSAGES.MILESTONE_UPDATED };
};

/**
 * Delete milestone
 */
export const deleteMilestone = async (projectId, milestoneId, userId) => {
  const milestone = await Milestone.findOne({
    where: { id: milestoneId, projectId },
  });
  if (!milestone) {
    return { success: false, statusCode: 404, message: MESSAGES.MILESTONE_NOT_FOUND };
  }

  await milestone.destroy();

  await logActivity(
    projectId,
    userId,
    ACTIVITY_TYPE.MILESTONE_DELETED,
    `Milestone '${milestone.title}' was deleted.`
  );

  await updateProjectProgress(projectId);

  return { success: true, message: MESSAGES.MILESTONE_DELETED };
};

/**
 * Retrieve project tasks
 */
export const getProjectTasks = async (projectId) => {
  const tasks = await Task.findAll({
    where: { projectId },
    include: [{ model: Milestone, as: "milestone" }],
    order: [["createdAt", "ASC"]],
  });

  return { success: true, data: tasks };
};

/**
 * Create project task
 */
export const createTask = async (projectId, taskData, userId) => {
  const project = await Project.findByPk(projectId);
  if (!project) {
    return { success: false, statusCode: 404, message: MESSAGES.PROJECT_NOT_FOUND };
  }

  const task = await Task.create({
    projectId,
    milestoneId: taskData.milestoneId || null,
    title: taskData.title,
    description: taskData.description,
    assignedTo: taskData.assignedTo || userId,
    priority: taskData.priority || "MEDIUM",
    status: TASK_STATUS.TODO,
    dueDate: taskData.dueDate,
  });

  await logActivity(
    projectId,
    userId,
    ACTIVITY_TYPE.TASK_CREATED,
    `Task '${task.title}' was created.`
  );

  await updateProjectProgress(projectId);

  return { success: true, data: task, message: MESSAGES.TASK_CREATED };
};

/**
 * Update task details or status
 */
export const updateTaskStatus = async (
  projectId,
  taskId,
  taskData,
  userId
) => {
  const task = await Task.findOne({ where: { id: taskId, projectId } });
  if (!task) {
    return { success: false, statusCode: 404, message: MESSAGES.TASK_NOT_FOUND };
  }

  const completedAt =
    taskData.status === TASK_STATUS.COMPLETED ? new Date() : task.completedAt;

  await task.update({
    ...taskData,
    completedAt,
  });

  await logActivity(
    projectId,
    userId,
    ACTIVITY_TYPE.TASK_UPDATED,
    `Task '${task.title}' updated.`
  );

  await updateProjectProgress(projectId);

  return { success: true, data: task, message: MESSAGES.TASK_UPDATED };
};

/**
 * Delete task
 */
export const deleteTask = async (projectId, taskId, userId) => {
  const task = await Task.findOne({ where: { id: taskId, projectId } });
  if (!task) {
    return { success: false, statusCode: 404, message: MESSAGES.TASK_NOT_FOUND };
  }

  await task.destroy();

  await logActivity(
    projectId,
    userId,
    ACTIVITY_TYPE.TASK_DELETED,
    `Task '${task.title}' was deleted.`
  );

  await updateProjectProgress(projectId);

  return { success: true, message: MESSAGES.TASK_DELETED };
};

// ─── Project Submission & Files ───────────────────────────────────────────────

/**
 * Submit project and save submission record
 */
export const submitProject = async (projectId, submissionData, userId) => {
  const project = await Project.findByPk(projectId);
  if (!project) {
    return { success: false, statusCode: 404, message: MESSAGES.PROJECT_NOT_FOUND };
  }

  const submission = await sequelize.transaction(async (transaction) => {
    const previousSubmissionsCount = await ProjectSubmission.count({
      where: { projectId },
      transaction,
    });

    const newSubmission = await ProjectSubmission.create(
      {
        projectId,
        submittedBy: userId,
        repositoryUrl: submissionData.repositoryUrl,
        branchName: submissionData.branchName || "main",
        submissionNotes: submissionData.submissionNotes,
        demoUrl: submissionData.demoUrl,
        status: "SUBMITTED",
        version: previousSubmissionsCount + 1,
      },
      { transaction }
    );

    await project.update({ githubRepoUrl: submissionData.repositoryUrl }, { transaction });

    const existingRepo = await ProjectRepository.findOne({ where: { projectId }, transaction });
    if (existingRepo) {
      await existingRepo.update(
        {
          repoUrl: submissionData.repositoryUrl,
          branch: submissionData.branchName || "main",
        },
        { transaction }
      );
    } else {
      await ProjectRepository.create(
        {
          projectId,
          repoUrl: submissionData.repositoryUrl,
          branch: submissionData.branchName || "main",
        },
        { transaction }
      );
    }

    return newSubmission;
  });

  await logActivity(
    projectId,
    userId,
    ACTIVITY_TYPE.SUBMISSION_CREATED,
    `Project submitted (Version ${submission.version}).`
  );

  return {
    success: true,
    data: submission,
    message: MESSAGES.SUBMISSION_SUCCESS,
  };
};

/**
 * Update submission record
 */
export const updateSubmission = async (
  projectId,
  submissionId,
  submissionData,
  userId
) => {
  const submission = await ProjectSubmission.findOne({
    where: { id: submissionId, projectId },
  });

  if (!submission) {
    return { success: false, statusCode: 404, message: MESSAGES.SUBMISSION_NOT_FOUND };
  }

  await submission.update(submissionData);

  await logActivity(
    projectId,
    userId,
    ACTIVITY_TYPE.SUBMISSION_UPDATED,
    `Submission version ${submission.version} updated.`
  );

  return { success: true, data: submission, message: MESSAGES.SUBMISSION_UPDATED };
};

/**
 * Retrieve submission history for project
 */
export const getSubmissionHistory = async (projectId) => {
  const submissions = await ProjectSubmission.findAll({
    where: { projectId },
    include: [{ model: MentorReview, as: "reviews" }],
    order: [["createdAt", "DESC"]],
  });

  return { success: true, data: submissions };
};

/**
 * Upload project file records
 */
export const uploadProjectFiles = async (projectId, files = [], userId) => {
  const project = await Project.findByPk(projectId);
  if (!project) {
    return { success: false, statusCode: 404, message: MESSAGES.PROJECT_NOT_FOUND };
  }

  const createdFiles = [];

  for (const file of files) {
    const fileRecord = await ProjectFile.create({
      projectId,
      uploadedBy: userId,
      fileName: file.filename,
      originalName: file.originalname,
      filePath: file.path,
      fileSize: file.size,
      fileType: file.mimetype,
    });
    createdFiles.push(fileRecord);

    await logActivity(
      projectId,
      userId,
      ACTIVITY_TYPE.FILE_UPLOADED,
      `File '${file.originalname}' uploaded.`
    );
  }

  return {
    success: true,
    data: createdFiles,
    message: MESSAGES.FILE_UPLOADED,
  };
};

/**
 * Delete uploaded file
 */
export const deleteProjectFile = async (projectId, fileId, userId) => {
  const fileRecord = await ProjectFile.findOne({
    where: { id: fileId, projectId },
  });
  if (!fileRecord) {
    return { success: false, statusCode: 404, message: MESSAGES.FILE_NOT_FOUND };
  }

  if (fs.existsSync(fileRecord.filePath)) {
    try {
      fs.unlinkSync(fileRecord.filePath);
    } catch (error) {
      console.warn(`Failed to delete physical file at ${fileRecord.filePath}:`, error);
    }
  }

  await fileRecord.destroy();

  await logActivity(
    projectId,
    userId,
    ACTIVITY_TYPE.FILE_DELETED,
    `File '${fileRecord.originalName}' deleted.`
  );

  return { success: true, message: MESSAGES.FILE_DELETED };
};

// ─── GitHub Repository Management ─────────────────────────────────────────────

/**
 * Retrieve GitHub Repository Info for a project
 */
export const getProjectRepository = async (projectId) => {
  const project = await Project.findByPk(projectId);
  if (!project) {
    return { success: false, statusCode: 404, message: MESSAGES.PROJECT_NOT_FOUND };
  }

  let repo = await ProjectRepository.findOne({ where: { projectId } });

  if (!repo && project.githubRepoUrl) {
    repo = await ProjectRepository.create({
      projectId,
      repoUrl: project.githubRepoUrl,
      branch: "main",
    });
  }

  return { success: true, data: repo };
};

/**
 * Update GitHub Repository Info for a project
 */
export const updateProjectRepository = async (projectId, repoData, userId) => {
  const project = await Project.findByPk(projectId);
  if (!project) {
    return { success: false, statusCode: 404, message: MESSAGES.PROJECT_NOT_FOUND };
  }

  let repo = await ProjectRepository.findOne({ where: { projectId } });

  if (repo) {
    await repo.update({
      ...repoData,
      lastSyncedAt: new Date(),
    });
  } else {
    repo = await ProjectRepository.create({
      projectId,
      ...repoData,
      lastSyncedAt: new Date(),
    });
  }

  if (repoData.repoUrl) {
    await project.update({ githubRepoUrl: repoData.repoUrl });
  }

  await logActivity(
    projectId,
    userId,
    ACTIVITY_TYPE.REPOSITORY_UPDATED,
    `GitHub repository details updated.`
  );

  return { success: true, data: repo, message: MESSAGES.REPOSITORY_UPDATED };
};

// ─── Mentor Review Management ─────────────────────────────────────────────────

/**
 * Store mentor review feedback and evaluation
 */
export const storeMentorReview = async (projectId, reviewData, mentorId) => {
  const project = await Project.findByPk(projectId);
  if (!project) {
    return { success: false, statusCode: 404, message: MESSAGES.PROJECT_NOT_FOUND };
  }

  const review = await MentorReview.create({
    projectId,
    submissionId: reviewData.submissionId || null,
    mentorId,
    feedback: reviewData.feedback,
    score: reviewData.score !== undefined ? reviewData.score : null,
    status: reviewData.status || "COMPLETED",
  });

  await logActivity(
    projectId,
    mentorId,
    ACTIVITY_TYPE.REVIEW_ADDED,
    `Mentor review submitted (Score: ${review.score ?? "N/A"}).`
  );

  return { success: true, data: review, message: MESSAGES.REVIEW_ADDED };
};

/**
 * Retrieve mentor reviews for project
 */
export const getMentorReviews = async (projectId) => {
  const reviews = await MentorReview.findAll({
    where: { projectId },
    include: [{ model: ProjectSubmission, as: "submission" }],
    order: [["createdAt", "DESC"]],
  });

  return { success: true, data: reviews };
};

/**
 * Update mentor review or publish final score
 */
export const updateMentorReview = async (
  projectId,
  reviewId,
  reviewData,
  mentorId
) => {
  const review = await MentorReview.findOne({
    where: { id: reviewId, projectId },
  });

  if (!review) {
    return { success: false, statusCode: 404, message: MESSAGES.REVIEW_NOT_FOUND };
  }

  await review.update(reviewData);

  await logActivity(
    projectId,
    mentorId,
    ACTIVITY_TYPE.REVIEW_UPDATED,
    `Mentor review evaluation updated.`
  );

  return { success: true, data: review, message: MESSAGES.REVIEW_UPDATED };
};

// ─── Analytics ────────────────────────────────────────────────────────────────

/**
 * Generate project analytics, completion percentage, activity timeline, and team statistics
 */
export const getProjectAnalytics = async (projectId) => {
  const projectDetails = await getProjectById(projectId);

  if (!projectDetails.success) {
    return projectDetails;
  }

  const project = projectDetails.data;
  const insights = generateProjectInsights(project);
  const teamStats = calculateTeamStats(project.members, project.tasks);

  const activities = await ProjectActivity.findAll({
    where: { projectId },
    order: [["createdAt", "DESC"]],
    limit: 20,
  });

  return {
    success: true,
    data: {
      projectId: project.id,
      title: project.title,
      progress: project.progress,
      status: project.status,
      insights,
      teamStats,
      activityTimeline: activities,
    },
  };
};
