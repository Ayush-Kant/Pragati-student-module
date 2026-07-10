// trainingLearningValidation.js
// Validation rules for the Training & Learning module

export const validateCourse = (course) => {
  const errors = {};

  if (!course) {
    return { valid: false, errors: { course: "Course data is required" } };
  }
  if (!course.title || !course.title.trim()) errors.title = "Course title is required";
  if (!course.category) errors.category = "Course category is required";
  if (!course.level) errors.level = "Course level is required";
  if (!course.instructor) errors.instructor = "Instructor name is required";
  if (course.progress == null || course.progress < 0 || course.progress > 100) {
    errors.progress = "Progress must be between 0 and 100";
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

export const validateLesson = (lesson) => {
  const errors = {};

  if (!lesson) {
    return { valid: false, errors: { lesson: "Lesson data is required" } };
  }
  if (!lesson.title || !lesson.title.trim()) errors.title = "Lesson title is required";
  if (!lesson.type) errors.type = "Lesson type is required";
  if (!lesson.courseId) errors.courseId = "Lesson must belong to a course";

  return { valid: Object.keys(errors).length === 0, errors };
};

export const validateProgress = (progressValue) => {
  const errors = {};
  const num = Number(progressValue);

  if (progressValue === null || progressValue === undefined || Number.isNaN(num)) {
    errors.progress = "Progress value is required and must be a number";
  } else if (num < 0 || num > 100) {
    errors.progress = "Progress must be between 0 and 100";
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

export const validateResources = (resource) => {
  const errors = {};

  if (!resource) {
    return { valid: false, errors: { resource: "Resource data is required" } };
  }
  if (!resource.title || !resource.title.trim()) errors.title = "Resource title is required";
  if (!resource.type) errors.type = "Resource type is required";
  if (!resource.url) errors.url = "Resource URL is required";

  return { valid: Object.keys(errors).length === 0, errors };
};
