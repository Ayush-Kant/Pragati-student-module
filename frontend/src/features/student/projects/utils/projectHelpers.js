/**
 * Utility helper functions for Projects Module
 */
import { PROJECT_STATUS_CONFIG, TASK_STATUS_CONFIG } from "../constants/projectConstants";

/**
 * Format ISO date string into friendly readable format
 */
export const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";

  const options = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return new Intl.DateTimeFormat("en-US", options).format(date);
};

/**
 * Format bytes into human readable MB/KB/GB
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Calculate completion percentage from array of tasks
 */
export const calculateProgressPercent = (tasks = []) => {
  if (!tasks || tasks.length === 0) return 0;
  const completed = tasks.filter((t) => t.status === "COMPLETED").length;
  return Math.round((completed / tasks.length) * 100);
};

/**
 * Get color configurations for project status badge
 */
export const getProjectStatusStyle = (status) => {
  return PROJECT_STATUS_CONFIG[status] || PROJECT_STATUS_CONFIG.NOT_STARTED;
};

/**
 * Get color configurations for task status badge
 */
export const getTaskStatusStyle = (status) => {
  return TASK_STATUS_CONFIG[status] || TASK_STATUS_CONFIG.NOT_STARTED;
};

/**
 * Validate GitHub URL format
 */
export const isValidGitHubUrl = (url) => {
  if (!url) return false;
  const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+\/?$/;
  return githubRegex.test(url);
};
