import Project from "../models/projectModel.js";
import Milestone from "../models/milestoneModel.js";
import Task from "../models/taskModel.js";
import ProjectSubmission from "../models/projectSubmissionModel.js";
import ProjectFile from "../models/projectFileModel.js";
import MentorReview from "../models/mentorReviewModel.js";
import ProjectMember from "../models/projectMemberModel.js";
import ProjectActivity from "../models/projectActivityModel.js";
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
  calculateProjectProgress,
  generateProjectInsights,
} from "../utils/projectHelpers.js";
import { ACTIVITY_TYPE, PROJECT_ROLE, MILESTONE_STATUS, TASK_STATUS } from "../constants/projectConstants.js";
import fs from "fs";

/**
 * Log activity for a project
 */
export const logActivity = async (projectId, userId, activityType, description, metadata = {}) => {
  try {
    return await ProjectActivity.create({
      projectId,
      userId,
      activityType,
      description,
      metadata,
    });
  } catch (error) {
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
    ],
  });

  if (!project) {
    return { success: false, statusCode: 404, message: "Project not found" };
  }

  return { success: true, data: project };
};

/**
 * Create a new project along with team members and activity log
 */
export const createProject = async (projectData, userId) => {
  const { title, description, category, tags, githubRepoUrl, startDate, endDate, teamMembers = [] } = projectData;

  const newProject = await Project.create({
    title,
    description,
    category,
    tags,
    githubRepoUrl,
    startDate,
    endDate,
    createdById: userId,
    status: "IN_PROGRESS",
    progress: 0,
  });

  // Always add creator as LEADER
  await ProjectMember.create({
    projectId: newProject.id,
    studentId: userId,
    role: PROJECT_ROLE.LEADER,
  });

  // Add additional team members
  for (const member of teamMembers) {
    if (member.studentId !== userId) {
      await ProjectMember.create({
        projectId: newProject.id,
        studentId: member.studentId,
        role: member.role || PROJECT_ROLE.MEMBER,
      });
    }
  }

  await logActivity(
    newProject.id,
    userId,
    ACTIVITY_TYPE.PROJECT_CREATED,
    `Project '${title}' was created.`
  );

  return getProjectById(newProject.id);
};

/**
 * Update project details
 */
export const updateProject = async (projectId, updateData, userId) => {
  const project = await Project.findByPk(projectId);
  if (!project) {
    return { success: false, statusCode: 404, message: "Project not found" };
  }

  await project.update(updateData);

  await logActivity(
    projectId,
    userId,
    ACTIVITY_TYPE.PROJECT_UPDATED,
    `Project parameters updated.`
  );

  return getProjectById(projectId);
};

/**
 * Delete project and associated resources
 */
export const deleteProject = async (projectId, userId) => {
  const project = await Project.findByPk(projectId);
  if (!project) {
    return { success: false, statusCode: 404, message: "Project not found" };
  }

  await project.destroy();
  return { success: true, message: "Project deleted successfully" };
};

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
    return { success: false, statusCode: 404, message: "Project not found" };
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

  return { success: true, data: milestone, message: "Milestone created successfully" };
};

/**
 * Update milestone details or status
 */
export const updateMilestone = async (projectId, milestoneId, milestoneData, userId) => {
  const milestone = await Milestone.findOne({ where: { id: milestoneId, projectId } });
  if (!milestone) {
    return { success: false, statusCode: 404, message: "Milestone not found" };
  }

  const completedAt = milestoneData.status === MILESTONE_STATUS.COMPLETED ? new Date() : milestone.completedAt;

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

  return { success: true, data: milestone, message: "Milestone updated successfully" };
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
    return { success: false, statusCode: 404, message: "Project not found" };
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

  return { success: true, data: task, message: "Task created successfully" };
};

/**
 * Update task details or status
 */
export const updateTaskStatus = async (projectId, taskId, taskData, userId) => {
  const task = await Task.findOne({ where: { id: taskId, projectId } });
  if (!task) {
    return { success: false, statusCode: 404, message: "Task not found" };
  }

  const completedAt = taskData.status === TASK_STATUS.COMPLETED ? new Date() : task.completedAt;

  await task.update({
    ...taskData,
    completedAt,
  });

  await logActivity(
    projectId,
    userId,
    ACTIVITY_TYPE.TASK_UPDATED,
    `Task '${task.title}' updated to ${task.status}.`
  );

  await updateProjectProgress(projectId);

  return { success: true, data: task, message: "Task updated successfully" };
};

/**
 * Submit project and save submission record
 */
export const submitProject = async (projectId, submissionData, userId) => {
  const project = await Project.findByPk(projectId);
  if (!project) {
    return { success: false, statusCode: 404, message: "Project not found" };
  }

  const previousSubmissionsCount = await ProjectSubmission.count({ where: { projectId } });

  const submission = await ProjectSubmission.create({
    projectId,
    submittedBy: userId,
    repositoryUrl: submissionData.repositoryUrl,
    branchName: submissionData.branchName || "main",
    submissionNotes: submissionData.submissionNotes,
    demoUrl: submissionData.demoUrl,
    status: "SUBMITTED",
    version: previousSubmissionsCount + 1,
  });

  await project.update({ githubRepoUrl: submissionData.repositoryUrl });

  await logActivity(
    projectId,
    userId,
    ACTIVITY_TYPE.SUBMISSION_CREATED,
    `Project submitted (Version ${submission.version}).`
  );

  return { success: true, data: submission, message: "Project submitted successfully" };
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
    return { success: false, statusCode: 404, message: "Project not found" };
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

  return { success: true, data: createdFiles, message: "Files uploaded successfully" };
};

/**
 * Delete uploaded file
 */
export const deleteProjectFile = async (projectId, fileId, userId) => {
  const fileRecord = await ProjectFile.findOne({ where: { id: fileId, projectId } });
  if (!fileRecord) {
    return { success: false, statusCode: 404, message: "File not found" };
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

  return { success: true, message: "File deleted successfully" };
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
 * Generate project analytics and insights
 */
export const getProjectAnalytics = async (projectId) => {
  const projectDetails = await getProjectById(projectId);

  if (!projectDetails.success) {
    return projectDetails;
  }

  const project = projectDetails.data;
  const insights = generateProjectInsights(project);

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
      activityTimeline: activities,
    },
  };
};
