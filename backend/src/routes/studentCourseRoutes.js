import express from 'express';
import authMiddleware from '../../middleware/authMiddleware.js';
import roleMiddleware from '../../middleware/roleMiddleware.js';
import {
  listCourses,
  getCourse,
  getLesson,
  saveWatchProgress,
  updateLessonProgress,
  getLessonNotes,
  saveLessonNote,
  deleteLessonNote,
  createResourceDownloadUrl,
  serveResourceFile,
} from '../controllers/studentCourseController.js';

const router = express.Router();

router.use(authMiddleware, roleMiddleware('student'));

// Static sub-routes MUST be declared before /:courseId so values such as
// "lessons" and "resources" can never be interpreted as numeric IDs.
router.get('/lessons/:lessonId', getLesson);
router.post('/lessons/:lessonId/progress', saveWatchProgress);
router.get('/lessons/:lessonId/notes', getLessonNotes);
router.post('/lessons/:lessonId/notes', saveLessonNote);
router.patch('/lessons/:lessonId/notes/:noteId', saveLessonNote);
router.delete('/lessons/:lessonId/notes/:noteId', deleteLessonNote);

router.get('/resources/:resourceId/download', createResourceDownloadUrl);
router.get('/resources/:resourceId/file', serveResourceFile);

router.get('/', listCourses);
router.get('/:courseId', getCourse);
router.patch('/:courseId/lessons/:lessonId/progress', updateLessonProgress);

export default router;
