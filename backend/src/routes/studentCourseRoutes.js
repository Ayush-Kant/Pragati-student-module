import express from 'express';
import authMiddleware from '../../middleware/authMiddleware.js';
import roleMiddleware from '../../middleware/roleMiddleware.js';
import {
  listCourses,
  getCourse,
  updateLessonProgress,
} from '../controllers/studentCourseController.js';

const router = express.Router();

router.use(authMiddleware, roleMiddleware('student'));

router.get('/', listCourses);
router.get('/:courseId', getCourse);
router.patch('/:courseId/lessons/:lessonId/progress', updateLessonProgress);

export default router;
