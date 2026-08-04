import { PROJECT_STATUS, TASK_STATUS, SUBMISSION_STATUS, REVIEW_STATUS } from '../constants/projectConstants';

/**
 * Format date string into human-readable format (e.g. "Aug 30, 2026")
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  } catch (e) {
    return dateString;
  }
};

/**
 * Format ISO timestamp into relative time or localized date-time
 */
export const formatDateTime = (isoString) => {
  if (!isoString) return 'N/A';
  try {
    const date = new Date(isoString);
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  } catch (e) {
    return isoString;
  }
};

/**
 * Format bytes into human readable string (e.g., "4.8 MB")
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Calculate completion percentage based on completed tasks
 */
export const calculateCompletionPercentage = (tasks = []) => {
  if (!tasks || tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.status === TASK_STATUS.DONE).length;
  return Math.round((completed / tasks.length) * 100);
};

/**
 * Calculate overall milestone progress percentage
 */
export const calculateProjectProgress = (milestones = []) => {
  if (!milestones || milestones.length === 0) return 0;
  let totalTasks = 0;
  let completedTasks = 0;

  milestones.forEach(m => {
    if (m.tasks) {
      totalTasks += m.tasks.length;
      completedTasks += m.tasks.filter(t => t.status === TASK_STATUS.DONE).length;
    }
  });

  if (totalTasks === 0) return 0;
  return Math.round((completedTasks / totalTasks) * 100);
};

/**
 * Maps project status to Tailwind CSS badge color classes
 */
export const getProjectStatusBadgeColor = (status) => {
  switch (status) {
    case PROJECT_STATUS.COMPLETED:
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case PROJECT_STATUS.IN_PROGRESS:
      return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    case PROJECT_STATUS.UNDER_REVIEW:
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case PROJECT_STATUS.NEEDS_REVISION:
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    case PROJECT_STATUS.OVERDUE:
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    case PROJECT_STATUS.NOT_STARTED:
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

/**
 * Maps task status to Tailwind CSS badge colors
 */
export const getTaskStatusBadgeColor = (status) => {
  switch (status) {
    case TASK_STATUS.DONE:
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    case TASK_STATUS.IN_PROGRESS:
      return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    case TASK_STATUS.TODO:
    default:
      return 'bg-slate-700/50 text-slate-300 border-slate-600/40';
  }
};

/**
 * Maps submission status to badge styles
 */
export const getSubmissionStatusBadgeColor = (status) => {
  switch (status) {
    case SUBMISSION_STATUS.APPROVED:
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case SUBMISSION_STATUS.SUBMITTED:
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case SUBMISSION_STATUS.NEEDS_REVISION:
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    case SUBMISSION_STATUS.REJECTED:
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

/**
 * Helper to display human-readable status labels
 */
export const formatStatusLabel = (status) => {
  if (!status) return '';
  return status
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
