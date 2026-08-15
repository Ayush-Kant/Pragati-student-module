// src/features/student/placement/utils/applicationHelpers.js
// Formatting, badges, and timeline progression helpers for job applications.

import {
  APPLICATION_STATUS,
  APPLICATION_STATUS_ORDER,
  TERMINAL_STATUSES,
  JOB_TYPE,
} from '../constants/placementConstants';

/**
 * Returns badge styling for application statuses (7-state enum)
 */
export function getApplicationStatusBadge(status) {
  switch (status) {
    case APPLICATION_STATUS.SELECTED:
      return {
        label: 'Selected',
        className: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold',
        dot: 'bg-emerald-500',
      };
    case APPLICATION_STATUS.INTERVIEW:
      return {
        label: 'Interview',
        className: 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold',
        dot: 'bg-indigo-500',
      };
    case APPLICATION_STATUS.ASSESSMENT:
      return {
        label: 'Assessment',
        className: 'bg-purple-50 text-purple-700 border border-purple-200 font-semibold',
        dot: 'bg-purple-500',
      };
    case APPLICATION_STATUS.SHORTLISTED:
      return {
        label: 'Shortlisted',
        className: 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold',
        dot: 'bg-blue-500',
      };
    case APPLICATION_STATUS.APPLIED:
      return {
        label: 'Applied',
        className: 'bg-slate-100 text-slate-700 border border-slate-200 font-medium',
        dot: 'bg-slate-400',
      };
    case APPLICATION_STATUS.REJECTED:
      return {
        label: 'Rejected',
        className: 'bg-rose-50 text-rose-700 border border-rose-200 font-medium',
        dot: 'bg-rose-500',
      };
    case APPLICATION_STATUS.WITHDRAWN:
      return {
        label: 'Withdrawn',
        className: 'bg-amber-50 text-amber-700 border border-amber-200 font-medium',
        dot: 'bg-amber-500',
      };
    default:
      return {
        label: status || 'Unknown',
        className: 'bg-slate-100 text-slate-700 border border-slate-200 font-medium',
        dot: 'bg-slate-400',
      };
  }
}

/**
 * Returns badge styling for job types
 */
export function getJobTypeBadge(jobType) {
  switch (jobType) {
    case JOB_TYPE.FULL_TIME:
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case JOB_TYPE.INTERNSHIP:
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case JOB_TYPE.PART_TIME:
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case JOB_TYPE.CONTRACT:
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case JOB_TYPE.REMOTE:
      return 'bg-teal-50 text-teal-700 border-teal-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

/**
 * Calculates timeline step state (completed, active, pending, rejected, withdrawn)
 * strictly from backend-provided application timeline entries and current status.
 *
 * Visual progression:
 * - Completed: ✓ (Green/Indigo filled)
 * - Active: ● (Pulsing / Current active round)
 * - Pending: ○ (Outlined grey circle)
 * - Special terminal: Rejected / Withdrawn indicators
 */
export function getTimelineStepState(stepStatus, currentStatus, timelineEntries = []) {
  const isRejected = currentStatus === APPLICATION_STATUS.REJECTED;
  const isWithdrawn = currentStatus === APPLICATION_STATUS.WITHDRAWN;

  // Check if this step is recorded in timeline entries
  const matchedEntry = timelineEntries.find((entry) => entry.stage === stepStatus);

  const currentIndex = APPLICATION_STATUS_ORDER.indexOf(currentStatus);
  const stepIndex = APPLICATION_STATUS_ORDER.indexOf(stepStatus);

  if (isRejected || isWithdrawn) {
    if (matchedEntry) {
      return {
        state: 'completed',
        entry: matchedEntry,
      };
    }
    return {
      state: 'disabled',
      entry: null,
    };
  }

  if (stepIndex < currentIndex) {
    return {
      state: 'completed',
      entry: matchedEntry,
    };
  }

  if (stepIndex === currentIndex) {
    return {
      state: 'active',
      entry: matchedEntry,
    };
  }

  return {
    state: 'pending',
    entry: null,
  };
}

/**
 * Formats filter params into clean query parameters for API calls
 */
export function buildApplicationQueryParams(filters = {}) {
  const params = {};

  if (filters.status) params.status = filters.status;
  if (filters.jobType) params.jobType = filters.jobType;
  if (filters.location) params.location = filters.location.trim();
  if (filters.dateRange) params.dateRange = filters.dateRange;
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;
  if (filters.search) params.search = filters.search.trim();
  if (filters.page) params.page = filters.page;
  if (filters.pageSize) params.pageSize = filters.pageSize;

  return params;
}
