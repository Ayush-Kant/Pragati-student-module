/**
 * General helpers for the Advanced Project Workspace (MOD-07).
 * Pure functions only — no side effects, no React imports.
 */

import {
  PROJECT_STATUS,
  PROJECT_STATUS_COLORS,
  PROJECT_STATUS_DOT,
  GRADE_BOUNDARIES,
} from '../constants/projectConstants';

// ─── Status Helpers ────────────────────────────────────────────────────────────

/**
 * Get Tailwind badge classes for a project status.
 * @param {string} status
 * @returns {string}
 */
export function getProjectStatusClasses(status) {
  return (
    PROJECT_STATUS_COLORS[status] ??
    'bg-gray-700/20 text-gray-400 border border-gray-700/40'
  );
}

/**
 * Get dot colour class for a project status indicator.
 * @param {string} status
 * @returns {string}
 */
export function getProjectStatusDot(status) {
  return PROJECT_STATUS_DOT[status] ?? 'bg-gray-500';
}

/**
 * Determine whether a project deadline has passed.
 * @param {string} deadlineIso
 * @returns {boolean}
 */
export function isOverdue(deadlineIso) {
  if (!deadlineIso) return false;
  return new Date(deadlineIso) < new Date();
}

/**
 * Determine whether a project is approaching its deadline (within N days).
 * @param {string} deadlineIso
 * @param {number} [withinDays=3]
 * @returns {boolean}
 */
export function isApproachingDeadline(deadlineIso, withinDays = 3) {
  if (!deadlineIso) return false;
  const deadline = new Date(deadlineIso);
  const now = new Date();
  const diffMs = deadline - now;
  return diffMs > 0 && diffMs <= withinDays * 24 * 60 * 60 * 1000;
}

// ─── Date / Time Formatting ────────────────────────────────────────────────────

/**
 * Format an ISO date string to a readable deadline string.
 * @param {string} isoString
 * @returns {string} e.g. "Aug 28, 2025" or "Aug 28 at 11:59 PM"
 */
export function formatDeadline(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Return a human-friendly relative time string.
 * @param {string} isoString
 * @returns {string} e.g. "3 days ago", "in 5 days", "Today"
 */
export function formatRelativeTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = date - now;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1) return `in ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
}

/**
 * Format an ISO date string to a short human-readable date.
 * @param {string} isoString
 * @returns {string} e.g. "Aug 14, 2025"
 */
export function formatDate(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ─── Progress Helpers ──────────────────────────────────────────────────────────

/**
 * Clamp a progress value between 0 and 100.
 * @param {number} value
 * @returns {number}
 */
export function clampProgress(value) {
  if (typeof value !== 'number' || isNaN(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

/**
 * Return a CSS colour class for a progress percentage.
 * @param {number} pct
 * @returns {string}
 */
export function getProgressColor(pct) {
  if (pct >= 80) return 'bg-emerald-500';
  if (pct >= 50) return 'bg-blue-500';
  if (pct >= 25) return 'bg-yellow-500';
  return 'bg-red-500';
}

// ─── Evaluation / Grade ────────────────────────────────────────────────────────

/**
 * Resolve a percentage score to a grade object.
 * @param {number} percentage
 * @returns {{ grade: string, label: string }}
 */
export function resolveGrade(percentage) {
  for (const boundary of GRADE_BOUNDARIES) {
    if (percentage >= boundary.min) {
      return { grade: boundary.grade, label: boundary.label };
    }
  }
  return { grade: 'F', label: 'Fail' };
}

/**
 * Get a colour class for a grade letter.
 * @param {string} grade
 * @returns {string}
 */
export function getGradeColor(grade) {
  const map = {
    'A+': 'text-emerald-400',
    'A':  'text-teal-400',
    'B':  'text-blue-400',
    'C':  'text-yellow-400',
    'D':  'text-orange-400',
    'F':  'text-red-400',
  };
  return map[grade] ?? 'text-gray-400';
}

// ─── Project Filtering & Sorting ───────────────────────────────────────────────

/**
 * Filter projects by status.
 * @param {object[]} projects
 * @param {string} status - 'All' or a specific PROJECT_STATUS value.
 * @returns {object[]}
 */
export function filterByStatus(projects, status) {
  if (!status || status === 'All') return projects;
  return projects.filter((p) => p.status === status);
}

/**
 * Search projects by title or tech stack (case-insensitive).
 * @param {object[]} projects
 * @param {string} query
 * @returns {object[]}
 */
export function searchProjects(projects, query) {
  if (!query || query.trim() === '') return projects;
  const q = query.toLowerCase().trim();
  return projects.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.techStack?.some((t) => t.toLowerCase().includes(q))
  );
}

/**
 * Count projects grouped by status.
 * @param {object[]} projects
 * @returns {Record<string, number>}
 */
export function countByStatus(projects) {
  return projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});
}

/**
 * Calculate overall stats from a project list.
 * @param {object[]} projects
 * @returns {{ total: number, inProgress: number, completed: number, overdue: number, evaluated: number }}
 */
export function computeProjectStats(projects) {
  return {
    total:      projects.length,
    inProgress: projects.filter((p) => p.status === PROJECT_STATUS.IN_PROGRESS).length,
    completed:  projects.filter((p) => p.status === PROJECT_STATUS.COMPLETED).length,
    overdue:    projects.filter((p) => p.status === PROJECT_STATUS.OVERDUE).length,
    evaluated:  projects.filter((p) => p.status === PROJECT_STATUS.EVALUATED).length,
  };
}
