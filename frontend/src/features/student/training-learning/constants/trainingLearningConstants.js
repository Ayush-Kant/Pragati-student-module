// trainingLearningConstants.js
// Central constants for the Training & Learning module

export const TRAINING_API = {
  GET_COURSES:          "/api/students/:id/training/courses",
  GET_COURSE_BY_ID:     "/api/students/training/courses/:courseId",
  GET_LESSONS:          "/api/students/training/courses/:courseId/lessons",
  GET_LESSON_DETAILS:   "/api/students/training/lessons/:lessonId",
  GET_RESOURCES:        "/api/students/training/courses/:courseId/resources",
  GET_COURSE_PROGRESS:  "/api/students/training/courses/:courseId/progress",
  UPDATE_LESSON_PROGRESS: "/api/students/training/lessons/:lessonId/progress",
};

export const LOADING_STATES = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

export const COURSE_STATUS = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

export const COURSE_STATUS_COLORS = {
  [COURSE_STATUS.NOT_STARTED]: { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200" },
  [COURSE_STATUS.IN_PROGRESS]: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  [COURSE_STATUS.COMPLETED]:   { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
};

export const COURSE_LEVELS = ["Beginner", "Intermediate", "Advanced"];

export const COURSE_CATEGORIES = [
  "Web Development",
  "Programming",
  "Data Science",
  "Cloud & DevOps",
  "Design",
];

export const LESSON_TYPES = {
  VIDEO: "video",
  READING: "reading",
  QUIZ: "quiz",
};

export const RESOURCE_TYPES = {
  PDF: "pdf",
  DOC: "doc",
  ZIP: "zip",
  LINK: "link",
  NOTES: "notes",
};

export const DEFAULT_PAGE_SIZE = 8;

export const EMPTY_MESSAGES = {
  COURSES: "No courses found. Try adjusting your search or filters.",
  LESSONS: "No lessons available for this course yet.",
  RESOURCES: "No learning resources have been uploaded for this course yet.",
};
