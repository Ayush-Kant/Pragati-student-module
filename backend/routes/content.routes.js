import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
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
} from '../controllers/content.controller.js';

const router = express.Router();

router.use(authMiddleware);

// This route is intentionally auth-only because your task says to test it with a student token.
router.get('/lessons/:lessonId/check-access', checkLessonAccess);

router.use(roleMiddleware('mentor'));

// Courses
router.post('/courses', createCourse);
router.get('/courses', getCourses);
router.get('/courses/:courseId', getCourseById);
router.patch('/courses/:courseId', updateCourse);
router.delete('/courses/:courseId', deleteCourse);

// Modules
router.post('/courses/:courseId/modules', addModule);
router.delete('/modules/:moduleId', deleteModule);

// Lessons
router.put('/modules/:moduleId/reorder', reorderLessons);
router.post('/modules/:moduleId/lessons', addLesson);
router.patch('/lessons/:lessonId', updateLesson);

// Resources
router.post('/resources', addResource);
router.delete('/resources/:resourceId', deleteResource);

export default router;