/**
 * Service layer for Learning Modules.
 * All data operations for learning modules are centralized here.
 * Currently backed by shared dummy data (see ../types/learningModuleDummyData.js).
 *
 * To integrate with the real backend: replace the body of each function
 * with a `fetch(`${API_BASE_URL}/...`)` call. Signatures and return shapes
 * are designed to stay identical either way, so no caller changes are needed.
 */

import { dummyModules as initialModules } from "../types/learningModuleDummyData";

// Maintain in-memory state during the user session so mutations like
// `updateLearningProgress` don't modify the imported dummy data.
let moduleStore = initialModules.map((m) => ({ ...m }));

const MOCK_API_DELAY_MS = 500;
// TODO: Replace with actual API base URL once backend is ready.
// const API_BASE_URL = `${process.env.REACT_APP_API_URL}/learning-modules`;

/**
 * Simulated network delay.
 * @param {number} [ms=MOCK_API_DELAY_MS]
 * @returns {Promise<void>}
 */
function delay(ms = MOCK_API_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wrap a successful response.
 * @template T
 * @param {T} data
 * @returns {{ success: true, data: T, error: null }}
 */
function wrapSuccess(data) {
  return { success: true, data, error: null };
}

/**
 * Wrap an error response.
 * @param {string} [message="An unknown error occurred"]
 * @returns {{ success: false, data: null, error: string }}
 */
function wrapError(message = "An unknown error occurred") {
  return { success: false, data: null, error: message };
}

/**
 * Recursively deep-clone a module to avoid mutating the in-memory store
 * when returning mutated objects to callers.
 * @template T
 * @param {T} item
 * @returns {T}
 */
function deepClone(item) {
  return JSON.parse(JSON.stringify(item));
}

/**
 * Find a module by id.
 * @param {string} moduleId
 * @returns {object|undefined}
 */
function findModule(moduleId) {
  return moduleStore.find((m) => String(m.id) === String(moduleId));
}

/**
 * Calculate the progress percentage for a module based on completed lessons.
 * @param {Array} lessons
 * @returns {number}
 */
function calculateProgress(lessons) {
  if (!lessons || lessons.length === 0) return 0;
  const completedCount = lessons.filter((l) => l.isCompleted).length;
  return Math.round((completedCount / lessons.length) * 100);
}

/**
 * @typedef {Object} LearningModule
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} category
 * @property {string} level
 * @property {number} duration
 * @property {number} progress
 * @property {string} image
 * @property {string[]} tags
 * @property {string} lastAccessed
 * @property {string[]} prerequisites
 * @property {Lesson[]} lessons
 */

/**
 * @typedef {Object} Lesson
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {number} duration
 * @property {boolean} isCompleted
 * @property {string} contentPreview
 * @property {Resource[]} resources
 */

/**
 * @typedef {Object} Resource
 * @property {string} id
 * @property {string} type
 * @property {string} title
 * @property {string} url
 */

/**
 * GET all learning modules.
 * Simulates async network request with 500ms latency.
 *
 * @returns {Promise<{ success: boolean, data: LearningModule[], error: string | null }>}
 */
export async function getLearningModules() {
  try {
    await delay();
    // TODO: Replace with real API call.
    // const res = await fetch(`${API_BASE_URL}/modules`);
    // if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // const json = await res.json();
    // return wrapSuccess(json);

    return wrapSuccess(moduleStore.map((m) => deepClone(m)));
  } catch (err) {
    return wrapError(err.message || "Failed to fetch learning modules");
  }
}

/**
 * GET a single learning module by id.
 * Simulates async network request with 500ms latency.
 *
 * @param {string} id - The module id (e.g. "react-fundamentals").
 * @returns {Promise<{ success: boolean, data: LearningModule | null, error: string | null }>}
 */
export async function getModuleById(id) {
  try {
    await delay();
    // TODO: Replace with real API call.
    // const res = await fetch(`${API_BASE_URL}/modules/${id}`);
    // if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // const json = await res.json();
    // return wrapSuccess(json);

    const module = findModule(id);
    if (!module) {
      return wrapError(`Learning module with id "${id}" not found`);
    }

    return wrapSuccess(deepClone(module));
  } catch (err) {
    return wrapError(err.message || "Failed to fetch learning module");
  }
}

/**
 * GET lessons for a specific learning module.
 * Simulates async network request with 500ms latency.
 *
 * @param {string} moduleId - The module id.
 * @returns {Promise<{ success: boolean, data: Lesson[] | null, error: string | null }>}
 */
export async function getLessons(moduleId) {
  try {
    await delay();
    // TODO: Replace with real API call.
    // const res = await fetch(`${API_BASE_URL}/modules/${moduleId}/lessons`);
    // if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // const json = await res.json();
    // return wrapSuccess(json);

    const module = findModule(moduleId);
    if (!module) {
      return wrapError(`Learning module with id "${moduleId}" not found`);
    }

    return wrapSuccess(deepClone(module.lessons || []));
  } catch (err) {
    return wrapError(err.message || "Failed to fetch lessons");
  }
}

/**
 * PATCH a lesson completion status and recalculate module progress.
 * Simulates async network request with 500ms latency.
 *
 * @param {string} moduleId - The module id.
 * @param {string} lessonId - The lesson id.
 * @param {boolean} completed - Whether the lesson should be marked completed.
 * @returns {Promise<{ success: boolean, data: LearningModule | null, error: string | null }>}
 */
export async function updateLearningProgress(moduleId, lessonId, completed) {
  try {
    await delay();
    // TODO: Replace with real API call.
    // const res = await fetch(`${API_BASE_URL}/modules/${moduleId}/lessons/${lessonId}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ isCompleted: completed }),
    // });
    // if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // const json = await res.json();
    // return wrapSuccess(json);

    const moduleIndex = moduleStore.findIndex(
      (m) => String(m.id) === String(moduleId)
    );
    if (moduleIndex === -1) {
      return wrapError(`Learning module with id "${moduleId}" not found`);
    }

    const module = moduleStore[moduleIndex];
    const lessonIndex = module.lessons.findIndex(
      (l) => String(l.id) === String(lessonId)
    );
    if (lessonIndex === -1) {
      return wrapError(`Lesson with id "${lessonId}" not found in module "${moduleId}"`);
    }

    // Mutate lesson completion status
    const updatedLessons = [...module.lessons];
    updatedLessons[lessonIndex] = {
      ...updatedLessons[lessonIndex],
      isCompleted: completed,
    };

    // Recalculate overall progress
    const newProgress = calculateProgress(updatedLessons);
    const now = new Date().toISOString();

    const updatedModule = {
      ...module,
      lessons: updatedLessons,
      progress: newProgress,
      lastAccessed: completed ? now : module.lastAccessed,
    };

    // Persist to in-memory store
    moduleStore[moduleIndex] = updatedModule;

    return wrapSuccess(deepClone(updatedModule));
  } catch (err) {
    return wrapError(err.message || "Failed to update learning progress");
  }
}

const learningModuleService = {
  getLearningModules,
  getModuleById,
  getLessons,
  updateLearningProgress,
};

export default learningModuleService;
