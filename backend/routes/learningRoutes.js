// learningRoutes.js

import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import * as validator from "../validators/learningValidator.js";
import * as controller from "../controllers/learningController.js";

const router = express.Router();

router.use(authMiddleware, roleMiddleware("student"));

router.get("/courses", controller.getCourses);

router.get(
  "/courses/:courseId",
  validator.validateCourseId,
  controller.getCourseDetail,
);

router.get(
  "/lessons/:lessonId",
  validator.validateLessonId,
  controller.getLesson,
);

router.get(
  "/lessons/:lessonId/resources",
  validator.validateLessonId,
  controller.getResources,
);

router.post(
  "/lessons/:lessonId/progress",
  validator.validateProgress,
  controller.updateLessonProgress,
);

router.post("/notes", validator.validateNote, controller.saveNotes);

router.get("/continue-learning", controller.getContinueLearning);

export default router;
