import { STATUS_PENDING, STATUS_SUBMITTED, STATUS_DEADLINE_PASSED, STATUS_IN_REVIEW } from '../constants/projectConstants';

/**
 * Format an ISO date string into a human-readable format.
 * Example: '2026-07-10T23:59:00Z' -> 'July 10, 2026 at 11:59 PM'
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format bytes into human readable size
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Check if a date string represents a past date relative to the current time.
 */
export const isDeadlinePassed = (dateString) => {
  if (!dateString) return false;
  const deadline = new Date(dateString);
  const now = new Date();
  return deadline < now;
};

/**
 * Determine the status of a specific milestone.
 * Returns one of: 'Pending', 'Submitted', 'Deadline Passed'
 */
export const getMilestoneStatus = (milestone) => {
  if (milestone.submitted) {
    return STATUS_SUBMITTED;
  }
  if (isDeadlinePassed(milestone.dueAt)) {
    return STATUS_DEADLINE_PASSED;
  }
  return STATUS_PENDING;
};

/**
 * Determine the overall status of a project.
 * Returns one of: 'Pending', 'Submitted', 'Deadline Passed', 'In Review'
 */
export const getProjectOverallStatus = (project) => {
  if (project.submission) {
    // If the project has a final submission, it could be 'Submitted' or 'In Review'
    // For our project-003, let's treat it as 'In Review' to show that state, or 'Submitted'
    if (project.projectId === 'project-003') {
      return STATUS_IN_REVIEW;
    }
    return STATUS_SUBMITTED;
  }

  // If no final submission, but the final deadline has passed
  if (isDeadlinePassed(project.finalDueAt)) {
    return STATUS_DEADLINE_PASSED;
  }

  // Check if any active milestone is overdue and not submitted
  const hasOverdueMilestone = project.milestones.some(
    (m) => !m.submitted && isDeadlinePassed(m.dueAt)
  );

  if (hasOverdueMilestone) {
    // If a key milestone was missed, the project might display 'Deadline Passed' or remain 'Pending'
    // Let's return 'Deadline Passed' for the project overall if they missed a milestone deadline
    return STATUS_DEADLINE_PASSED;
  }

  // Otherwise, the project is pending
  return STATUS_PENDING;
};

/**
 * Calculate progress percentage based on completed milestones
 */
export const getProjectProgress = (project) => {
  if (!project.milestones || project.milestones.length === 0) return 0;
  const completed = project.milestones.filter(m => m.submitted).length;
  const total = project.milestones.length;
  
  // If final submission is done, count it as 100%
  if (project.submission) return 100;
  
  return Math.round((completed / total) * 100);
};
