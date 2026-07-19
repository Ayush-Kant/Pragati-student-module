import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  addModule,
  deleteModule,
  reorderLessons,
  addLesson,
  updateLesson,
  checkLessonAccess,
  addResource,
  deleteResource,
} from "../controllers/content.controller.js";

import {
  validateCreateCourse,
  validateUpdateCourse,
  validateAddModule,
} from "../validators/content.validator.js";

const router = express.Router();

// Apply global authentication to all routes below
router.use(authMiddleware);

// ==========================================
// Student-Accessible Routes (Auth-Only)
// ==========================================
// This route is intentionally auth-only because it needs to be tested with a student token.
router.get("/lessons/:lessonId/check-access", checkLessonAccess);

// ==========================================
// Protected Routes (Mentor / Admin Only)
// ==========================================
// Apply role middleware for all subsequent routes
router.use(roleMiddleware("mentor", "admin"));

// Courses
router.post("/courses", validateCreateCourse, createCourse);
router.get("/courses", getCourses);
router.get("/courses/:courseId", getCourseById);
router.patch("/courses/:courseId", validateUpdateCourse, updateCourse);
router.delete("/courses/:courseId", deleteCourse);

// Modules
router.post("/courses/:courseId/modules", validateAddModule, addModule);
router.delete("/modules/:moduleId", deleteModule);

// Lessons
router.put("/modules/:moduleId/reorder", reorderLessons);
router.post("/modules/:moduleId/lessons", addLesson);
router.patch("/lessons/:lessonId", updateLesson);

// Resources
router.post("/resources", addResource);
router.delete("/resources/:resourceId", deleteResource);

export default router;
