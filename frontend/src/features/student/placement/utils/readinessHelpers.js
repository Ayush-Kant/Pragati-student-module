// src/features/student/placement/utils/readinessHelpers.js
// Presentation and UI helpers for readiness report, categories, and recommendations.

import { RECOMMENDATION_PRIORITY } from '../constants/placementConstants';

/**
 * Returns badge styling for recommendation priorities
 */
export function getPriorityBadge(priority) {
  switch (priority) {
    case RECOMMENDATION_PRIORITY.HIGH:
      return {
        label: 'High Priority',
        className: 'bg-rose-50 text-rose-700 border border-rose-200',
        dot: 'bg-rose-500',
      };
    case RECOMMENDATION_PRIORITY.MEDIUM:
      return {
        label: 'Medium Priority',
        className: 'bg-amber-50 text-amber-700 border border-amber-200',
        dot: 'bg-amber-500',
      };
    case RECOMMENDATION_PRIORITY.LOW:
    default:
      return {
        label: 'Low Priority',
        className: 'bg-blue-50 text-blue-700 border border-blue-200',
        dot: 'bg-blue-500',
      };
  }
}

/**
 * Returns icon / text styling for trend indicators
 */
export function getTrendIndicator(trend) {
  switch (trend?.toLowerCase()) {
    case 'improving':
    case 'up':
      return {
        label: 'Improving',
        icon: 'TrendingUp',
        className: 'text-emerald-600 bg-emerald-50',
      };
    case 'declining':
    case 'down':
      return {
        label: 'Declining',
        icon: 'TrendingDown',
        className: 'text-rose-600 bg-rose-50',
      };
    case 'stable':
    default:
      return {
        label: 'Stable',
        icon: 'Minus',
        className: 'text-slate-600 bg-slate-50',
      };
  }
}

/**
 * Formats skill gap score details for presentation
 */
export function formatSkillGap(current, target) {
  const gap = Math.max(0, target - current);
  return {
    gap,
    gapText: gap > 0 ? `+${gap} pts needed` : 'Target achieved',
    isAchieved: gap === 0,
  };
}
