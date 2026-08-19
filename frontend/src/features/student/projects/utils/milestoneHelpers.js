/**
 * Milestone helpers for the Advanced Project Workspace (MOD-07).
 * Pure functions only — no side effects, no React imports.
 */

import {
  MILESTONE_STATUS,
  MILESTONE_STATUS_COLORS,
  MILESTONE_NODE_COLORS,
} from '../constants/projectConstants';

// ─── Status Helpers ────────────────────────────────────────────────────────────

/**
 * Get Tailwind badge classes for a milestone status.
 * @param {string} status
 * @returns {string}
 */
export function getMilestoneStatusClasses(status) {
  return (
    MILESTONE_STATUS_COLORS[status] ??
    'bg-gray-700/20 text-gray-400 border border-gray-700/40'
  );
}

/**
 * Get Tailwind node/connector classes for the milestone timeline.
 * @param {string} status
 * @returns {string}
 */
export function getMilestoneNodeClasses(status) {
  return (
    MILESTONE_NODE_COLORS[status] ??
    'border-gray-600 bg-gray-800'
  );
}

/**
 * Check if a milestone due date has passed and the milestone is not complete.
 * @param {object} milestone
 * @returns {boolean}
 */
export function isMilestoneOverdue(milestone) {
  if (
    milestone.status === MILESTONE_STATUS.COMPLETED ||
    milestone.status === MILESTONE_STATUS.OVERDUE
  ) {
    return milestone.status === MILESTONE_STATUS.OVERDUE;
  }
  if (!milestone.dueDate) return false;
  return new Date(milestone.dueDate) < new Date();
}

/**
 * Get the active (current) milestone — the first one that isn't completed.
 * @param {object[]} milestones — sorted by order ascending.
 * @returns {object | null}
 */
export function getActiveMilestone(milestones) {
  if (!Array.isArray(milestones)) return null;
  return (
    milestones.find((m) => m.status !== MILESTONE_STATUS.COMPLETED) ?? null
  );
}

/**
 * Calculate the count of completed milestones.
 * @param {object[]} milestones
 * @returns {{ completed: number, total: number, percentage: number }}
 */
export function getMilestoneProgress(milestones) {
  if (!Array.isArray(milestones) || milestones.length === 0) {
    return { completed: 0, total: 0, percentage: 0 };
  }
  const total = milestones.length;
  const completed = milestones.filter(
    (m) => m.status === MILESTONE_STATUS.COMPLETED
  ).length;
  const percentage = Math.round((completed / total) * 100);
  return { completed, total, percentage };
}

// ─── Sorting ───────────────────────────────────────────────────────────────────

/**
 * Sort milestones by their `order` field ascending.
 * @param {object[]} milestones
 * @returns {object[]}
 */
export function sortMilestonesByOrder(milestones) {
  if (!Array.isArray(milestones)) return [];
  return [...milestones].sort((a, b) => a.order - b.order);
}

// ─── Timeline Helpers ──────────────────────────────────────────────────────────

/**
 * Format a milestone due date for the timeline view.
 * @param {string} isoString
 * @returns {string}
 */
export function formatMilestoneDue(isoString) {
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
 * Get a human-friendly label describing the deadline relative to today.
 * @param {string} isoString
 * @param {string} status
 * @returns {string}
 */
export function getMilestoneDueLabel(isoString, status) {
  if (status === MILESTONE_STATUS.COMPLETED) return 'Completed';
  if (!isoString) return '—';

  const date = new Date(isoString);
  const now = new Date();
  const diffMs = date - now;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  return `Due in ${diffDays} days`;
}

/**
 * Compute the node icon character for a milestone status.
 * @param {string} status
 * @returns {string}
 */
export function getMilestoneIcon(status) {
  const icons = {
    [MILESTONE_STATUS.COMPLETED]:   '✓',
    [MILESTONE_STATUS.IN_PROGRESS]: '◐',
    [MILESTONE_STATUS.PENDING]:     '○',
    [MILESTONE_STATUS.BLOCKED]:     '✕',
    [MILESTONE_STATUS.OVERDUE]:     '!',
  };
  return icons[status] ?? '○';
}
