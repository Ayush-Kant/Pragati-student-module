// trainingLearningHelpers.js
// Pure utility/formatting helpers used across the Training & Learning module

import { COURSE_STATUS } from "../constants/trainingLearningConstants";

/**
 * Derive a course's status label from its progress percentage.
 */
export const getStatusFromProgress = (progress) => {
  if (progress >= 100) return COURSE_STATUS.COMPLETED;
  if (progress > 0) return COURSE_STATUS.IN_PROGRESS;
  return COURSE_STATUS.NOT_STARTED;
};

/**
 * Clamp a progress value between 0 and 100.
 */
export const clampProgress = (value) => Math.min(100, Math.max(0, Number(value) || 0));

/**
 * Filter courses by search text, category, level and status.
 */
export const filterCourses = (courses, { search = "", category = "All", level = "All", status = "All" } = {}) => {
  const term = search.trim().toLowerCase();

  return courses.filter((course) => {
    const matchesSearch =
      !term ||
      course.title.toLowerCase().includes(term) ||
      course.instructor.toLowerCase().includes(term);

    const matchesCategory = category === "All" || course.category === category;
    const matchesLevel = level === "All" || course.level === level;
    const matchesStatus = status === "All" || course.status === status;

    return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
  });
};

/**
 * Group a flat lessons array by moduleTitle, preserving order.
 */
export const groupLessonsByModule = (lessons = []) => {
  const groups = [];
  const index = new Map();

  lessons.forEach((lesson) => {
    if (!index.has(lesson.moduleTitle)) {
      index.set(lesson.moduleTitle, { moduleTitle: lesson.moduleTitle, lessons: [] });
      groups.push(index.get(lesson.moduleTitle));
    }
    index.get(lesson.moduleTitle).lessons.push(lesson);
  });

  return groups;
};

/**
 * Find the next incomplete lesson after the given lesson id (for "Continue Learning").
 */
export const getNextLesson = (lessons = [], currentLessonId) => {
  const currentIndex = lessons.findIndex((l) => l.id === currentLessonId);
  return lessons.slice(currentIndex + 1).find((l) => !l.completed) || null;
};

/**
 * Calculate module completion percentage for a course.
 */
export const getModuleCompletionPercent = (course) => {
  if (!course?.totalModules) return 0;
  return clampProgress(Math.round((course.completedModules / course.totalModules) * 100));
};

/**
 * Human readable file-size / duration passthrough (kept for future formatting logic).
 */
export const formatMeta = (value) => value ?? "—";
