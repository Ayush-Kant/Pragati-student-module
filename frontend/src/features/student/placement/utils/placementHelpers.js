// src/features/student/placement/utils/placementHelpers.js
// Formatting and presentation helpers for general placement data.

import {
  READINESS_THRESHOLD,
  READINESS_LABEL,
  RESUME_STATUS,
  PROFILE_COMPLETION_THRESHOLD,
} from '../constants/placementConstants';

/**
 * Returns color classes and labels based on backend-provided score
 * @param {number} score 0 - 100
 */
export function getScoreColorClass(score) {
  if (score >= READINESS_THRESHOLD.EXCELLENT) {
    return {
      text: 'text-success-600',
      bg: 'bg-success-50',
      border: 'border-success-500',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      ring: '#16a34a',
      bar: 'bg-emerald-500',
    };
  }
  if (score >= READINESS_THRESHOLD.GOOD) {
    return {
      text: 'text-primary-600',
      bg: 'bg-primary-50',
      border: 'border-primary-500',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      ring: '#4f46e5',
      bar: 'bg-indigo-500',
    };
  }
  if (score >= READINESS_THRESHOLD.FAIR) {
    return {
      text: 'text-warning-600',
      bg: 'bg-warning-50',
      border: 'border-warning-500',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      ring: '#d97706',
      bar: 'bg-amber-500',
    };
  }
  return {
    text: 'text-danger-600',
    bg: 'bg-danger-50',
    border: 'border-danger-500',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    ring: '#e11d48',
    bar: 'bg-rose-500',
  };
}

/**
 * Returns descriptive label for a score
 */
export function getScoreLabel(score) {
  if (score >= READINESS_THRESHOLD.EXCELLENT) return READINESS_LABEL.EXCELLENT;
  if (score >= READINESS_THRESHOLD.GOOD) return READINESS_LABEL.GOOD;
  if (score >= READINESS_THRESHOLD.FAIR) return READINESS_LABEL.FAIR;
  return READINESS_LABEL.POOR;
}

/**
 * Returns badge styling for resume statuses
 */
export function getResumeStatusBadge(status) {
  switch (status) {
    case RESUME_STATUS.APPROVED:
      return {
        label: 'Approved',
        className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      };
    case RESUME_STATUS.UNDER_REVIEW:
      return {
        label: 'Under Review',
        className: 'bg-blue-50 text-blue-700 border border-blue-200',
      };
    case RESUME_STATUS.NEEDS_UPDATE:
      return {
        label: 'Needs Update',
        className: 'bg-amber-50 text-amber-700 border border-amber-200',
      };
    case RESUME_STATUS.UPLOADED:
      return {
        label: 'Uploaded',
        className: 'bg-purple-50 text-purple-700 border border-purple-200',
      };
    case RESUME_STATUS.NOT_UPLOADED:
    default:
      return {
        label: 'Not Uploaded',
        className: 'bg-slate-100 text-slate-700 border border-slate-200',
      };
  }
}

/**
 * Formats a standard ISO date to user-friendly local format
 */
export function formatDate(dateString, options = {}) {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      ...options,
    }).format(date);
  } catch {
    return '—';
  }
}

/**
 * Formats date and time
 */
export function formatDateTime(dateString) {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return '—';
  }
}

/**
 * Formats profile completion state
 */
export function getProfileCompletionStatus(percentage) {
  if (percentage >= PROFILE_COMPLETION_THRESHOLD.COMPLETE) {
    return {
      status: 'Complete',
      color: 'text-emerald-600',
      bg: 'bg-emerald-500',
    };
  }
  if (percentage >= PROFILE_COMPLETION_THRESHOLD.GOOD) {
    return {
      status: 'Almost There',
      color: 'text-indigo-600',
      bg: 'bg-indigo-500',
    };
  }
  return {
    status: 'Incomplete',
    color: 'text-amber-600',
    bg: 'bg-amber-500',
  };
}
