import { LEVEL_COLORS, CATEGORY_COLORS, MODULE_LEVELS, MODULE_CATEGORIES } from '../constants/learningConstants';

/**
 * Convert minutes to a human-readable "Xh Ym" format.
 * @param {number} minutes - Duration in minutes.
 * @returns {string} Formatted duration string.
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes <= 0) return '0m';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h`;
  return `${mins}m`;
};

/**
 * Format an ISO date string into a readable "Mon DD, YYYY" format.
 * @param {string} dateString - ISO date string (e.g., "2026-07-27T00:00:00+05:30").
 * @returns {string} Formatted date string.
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Return Tailwind text color class based on progress percentage.
 * @param {number} percentage - Progress percentage (0-100).
 * @returns {string} Tailwind text color class.
 */
export const getProgressColor = (percentage) => {
  if (percentage <= 30) return 'text-red-500';
  if (percentage <= 70) return 'text-yellow-500';
  return 'text-green-500';
};

/**
 * Return Tailwind background color class for progress bars based on percentage.
 * @param {number} percentage - Progress percentage (0-100).
 * @returns {string} Tailwind background color class.
 */
export const getProgressBarColor = (percentage) => {
  if (percentage <= 30) return 'bg-red-500';
  if (percentage <= 70) return 'bg-yellow-500';
  return 'bg-green-500';
};

/**
 * Calculate module progress percentage from lessons array.
 * @param {Array} lessons - Array of lesson objects.
 * @returns {number} Progress percentage (0-100).
 */
export const calculateModuleProgress = (lessons) => {
  if (!lessons || lessons.length === 0) return 0;
  const completedCount = lessons.filter((l) => l.isCompleted).length;
  return Math.round((completedCount / lessons.length) * 100);
};

/**
 * Get count of completed lessons.
 * @param {Array} lessons - Array of lesson objects.
 * @returns {number} Number of completed lessons.
 */
export const getCompletedLessonsCount = (lessons) => {
  if (!lessons || lessons.length === 0) return 0;
  return lessons.filter((l) => l.isCompleted).length;
};

/**
 * Get total lessons count.
 * @param {Array} lessons - Array of lesson objects.
 * @returns {number} Total number of lessons.
 */
export const getTotalLessonsCount = (lessons) => {
  if (!lessons || lessons.length === 0) return 0;
  return lessons.length;
};

/**
 * Get Tailwind badge classes for a module level.
 * @param {string} level - One of Beginner, Intermediate, Advanced.
 * @returns {string} Tailwind color classes.
 */
export const getLevelBadgeColor = (level) => {
  return LEVEL_COLORS[level] || 'bg-gray-100 text-gray-800';
};

/**
 * Get Tailwind badge classes for a module category.
 * @param {string} category - One of Frontend, Backend, DevOps, Database, Cloud, Mobile.
 * @returns {string} Tailwind color classes.
 */
export const getCategoryBadgeColor = (category) => {
  return CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-800';
};

/**
 * Search modules by title or description using a case-insensitive query.
 * @param {Array} modules - Array of learning modules.
 * @param {string} query - Search query string.
 * @returns {Array} Filtered modules matching the query.
 */
export const searchModules = (modules, query) => {
  if (!query || query.trim() === '') return modules;
  const lowerQuery = query.toLowerCase().trim();
  return modules.filter(
    (module) =>
      module.title.toLowerCase().includes(lowerQuery) ||
      module.description.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Filter modules by category.
 * @param {Array} modules - Array of learning modules.
 * @param {string} category - Category to filter by.
 * @returns {Array} Filtered modules.
 */
export const filterModulesByCategory = (modules, category) => {
  if (!category || category === 'All') return modules;
  return modules.filter((module) => module.category === category);
};

/**
 * Sort modules by a given field.
 * @param {Array} modules - Array of learning modules.
 * @param {string} sortBy - Sort field: 'title', 'progress', 'duration', or 'date'.
 * @returns {Array} Sorted modules.
 */
export const sortModules = (modules, sortBy) => {
  const sorted = [...modules];
  switch (sortBy) {
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'progress':
      return sorted.sort((a, b) => b.progress - a.progress);
    case 'duration':
      return sorted.sort((a, b) => a.duration - b.duration);
    case 'date':
      return sorted.sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed));
    default:
      return sorted;
  }
};
