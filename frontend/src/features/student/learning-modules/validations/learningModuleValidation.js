// Validation layer for learning modules.
// Every function returns `{ isValid: boolean, errors: string[] }`.

import {
  MODULE_CATEGORIES,
  MODULE_LEVELS,
  RESOURCE_TYPES,
} from "../constants/learningConstants";

const ok = () => ({ isValid: true, errors: [] });
const fail = (...errors) => ({ isValid: false, errors });

function isNil(value) {
  return value === null || value === undefined || value === "";
}

/**
 * Validate a learning module object.
 * @param {object} module
 * @param {string} module.id
 * @param {string} module.title
 * @param {string} module.description
 * @param {string} module.category
 * @param {string} module.level
 * @param {number} module.duration
 * @param {Array} module.lessons
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateModule(module) {
  if (isNil(module)) return fail("Module data is missing");

  const errors = [];

  if (isNil(module.id)) errors.push("Module id is required");
  if (isNil(module.title)) errors.push("Module title is required");
  if (isNil(module.description)) errors.push("Module description is required");

  const validCategories = Object.values(MODULE_CATEGORIES);
  if (!validCategories.includes(module.category)) {
    errors.push(`Invalid module category: ${module.category}`);
  }

  const validLevels = Object.values(MODULE_LEVELS);
  if (!validLevels.includes(module.level)) {
    errors.push(`Invalid module level: ${module.level}`);
  }

  if (typeof module.duration !== "number" || module.duration <= 0) {
    errors.push("Module duration must be a positive number");
  }

  if (!Array.isArray(module.lessons) || module.lessons.length === 0) {
    errors.push("Module must contain at least one lesson");
  }

  return errors.length ? fail(...errors) : ok();
}

/**
 * Validate a lesson object.
 * @param {object} lesson
 * @param {string} lesson.id
 * @param {string} lesson.title
 * @param {string} lesson.description
 * @param {number} lesson.duration
 * @param {Array} [lesson.resources]
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateLesson(lesson) {
  if (isNil(lesson)) return fail("Lesson data is missing");

  const errors = [];

  if (isNil(lesson.id)) errors.push("Lesson id is required");
  if (isNil(lesson.title)) errors.push("Lesson title is required");
  if (isNil(lesson.description)) errors.push("Lesson description is required");

  if (typeof lesson.duration !== "number" || lesson.duration <= 0) {
    errors.push("Lesson duration must be a positive number");
  }

  if (!Array.isArray(lesson.resources)) {
    errors.push("Lesson resources must be an array");
  }

  return errors.length ? fail(...errors) : ok();
}

/**
 * Validate a resource object.
 * @param {object} resource
 * @param {string} resource.id
 * @param {string} resource.title
 * @param {string} resource.type
 * @param {string} resource.url
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateResource(resource) {
  if (isNil(resource)) return fail("Resource data is missing");

  const errors = [];

  if (isNil(resource.id)) errors.push("Resource id is required");
  if (isNil(resource.title)) errors.push("Resource title is required");

  const validTypes = Object.values(RESOURCE_TYPES);
  if (!validTypes.includes(resource.type)) {
    errors.push(`Invalid resource type: ${resource.type}`);
  }

  if (isNil(resource.url)) {
    errors.push("Resource url is required");
  } else if (typeof resource.url !== "string" || !resource.url.trim()) {
    errors.push("Resource url must be a non-empty string");
  }

  return errors.length ? fail(...errors) : ok();
}

/**
 * Validate a progress update payload.
 * @param {string} moduleId
 * @param {string} lessonId
 * @param {boolean} completed
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateProgressUpdate(moduleId, lessonId, completed) {
  const errors = [];

  if (isNil(moduleId)) errors.push("moduleId is required");
  if (isNil(lessonId)) errors.push("lessonId is required");
  if (typeof completed !== "boolean") errors.push("completed must be a boolean");

  return errors.length ? fail(...errors) : ok();
}

/**
 * Validate a search query string.
 * @param {string} query
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateSearchQuery(query) {
  const errors = [];

  if (typeof query !== "string") {
    errors.push("Search query must be a string");
    return fail(...errors);
  }

  if (query.length > 100) {
    errors.push("Search query must not exceed 100 characters");
  }

  return errors.length ? fail(...errors) : ok();
}

/**
 * Validate a category filter value.
 * @param {string} category
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateFilter(category) {
  if (isNil(category)) return fail("Category filter is required");

  const validCategories = Object.values(MODULE_CATEGORIES);
  if (!validCategories.includes(category)) {
    return fail(`Invalid category filter: ${category}`);
  }

  return ok();
}
