// trainingLearningService.js
// API service layer for the Training & Learning module.
// Currently backed by shared dummy data — swap the body of each function
// for a real `fetch`/axios call to BASE_URL + TRAINING_API.* during integration.
// No hardcoded URLs: endpoint paths live in trainingLearningConstants.js

import {
  trainingCourses,
  trainingLessons,
  trainingResources,
  learningStatistics,
} from "../types/trainingLearningDummyData";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ── Helper — simulate network latency with dummy data ──────────
const simulateApi = (data, delay = 500) =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), delay));

// ─────────────────────────────────────────────────────
// COURSES
// ─────────────────────────────────────────────────────

export const getCourses = async () => {
  // TODO(integration): fetch(`${BASE_URL}${TRAINING_API.GET_COURSES}`, { headers: getHeaders() })
  return simulateApi(trainingCourses);
};

export const getCourseById = async (courseId) => {
  const course = trainingCourses.find((c) => c.id === Number(courseId));
  if (!course) throw new Error("Course not found");
  return simulateApi(course);
};

// ─────────────────────────────────────────────────────
// LESSONS
// ─────────────────────────────────────────────────────

export const getLessons = async (courseId) => {
  const lessons = trainingLessons[Number(courseId)] || [];
  return simulateApi(lessons);
};

export const getLessonDetails = async (courseId, lessonId) => {
  const lessons = trainingLessons[Number(courseId)] || [];
  const lesson = lessons.find((l) => l.id === Number(lessonId));
  if (!lesson) throw new Error("Lesson not found");
  return simulateApi(lesson);
};

// ─────────────────────────────────────────────────────
// LEARNING RESOURCES
// ─────────────────────────────────────────────────────

export const getLearningResources = async (courseId) => {
  const resources = trainingResources[Number(courseId)] || [];
  return simulateApi(resources);
};

// ─────────────────────────────────────────────────────
// PROGRESS
// ─────────────────────────────────────────────────────

export const getCourseProgress = async (courseId) => {
  const course = trainingCourses.find((c) => c.id === Number(courseId));
  if (!course) throw new Error("Course not found");
  return simulateApi({
    courseId: course.id,
    progress: course.progress,
    completedLessons: course.completedLessons,
    totalLessons: course.totalLessons,
    completedModules: course.completedModules,
    totalModules: course.totalModules,
    status: course.status,
  });
};

export const updateLessonProgress = async (lessonId, { completed = true } = {}) => {
  // TODO(integration): PATCH `${BASE_URL}${TRAINING_API.UPDATE_LESSON_PROGRESS}`
  return simulateApi({ lessonId, completed, updatedAt: new Date().toISOString() }, 300);
};

export const getLearningStatistics = async () => {
  return simulateApi(learningStatistics);
};

export { BASE_URL, getHeaders };
