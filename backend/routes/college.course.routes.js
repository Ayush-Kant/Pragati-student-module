// college.course.route.js

import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import * as validator from "../validators/college.course.validator.js";
import * as controller from "../controllers/college.course.controller.js";

const router = express.Router();

// ------------------------------------------------------------
// Public read endpoints (no auth required per module spec)
// ------------------------------------------------------------
router.get("/", controller.getCourses);
router.get("/:id", controller.getCourseById);

// ------------------------------------------------------------
// Protected write endpoints
// ------------------------------------------------------------
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "hod", "college"),
  validator.validateCourse,
  controller.createCourse
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "hod", "college"),
  validator.validateCourseUpdate,
  controller.updateCourse
);

router.delete("/:id", authMiddleware, roleMiddleware("admin", "hod", "college"), controller.deleteCourse);

export default router;