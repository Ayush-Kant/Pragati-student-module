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
} from "../controllers/content.controller.js";
import {
  validateCreateCourse,
  validateUpdateCourse,
  validateAddModule,
} from "../validators/content.validator.js";

const router = express.Router();

// All routes protected — mentor and admin only
router.use(authMiddleware);
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

export default router;