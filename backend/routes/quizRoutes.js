import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  getAvailableQuizzes,
  getQuizDetails,
  getQuizHistory,
  submitQuiz,
} from '../controllers/quizController.js';

const router = Router();

router.use(authMiddleware);

router.get('/quizzes', getAvailableQuizzes);
router.get('/quizzes/history', getQuizHistory);
router.get('/quizzes/:quizId', getQuizDetails);
router.post('/quizzes/:quizId/submit', submitQuiz);

export default router;
