import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  getAvailableQuizzes,
  getQuizDetails,
  getQuizHistory,
  submitQuiz,
  startQuiz,
  getAttempt,
  saveAnswer,
  submitAttempt,
  getResult,
  getPerformance,
} from '../controllers/quizController.js';

const router = Router();

router.use(authMiddleware);

router.get('/quizzes', getAvailableQuizzes);
router.get('/quizzes/history', getQuizHistory);
router.get('/quizzes/performance', getPerformance);
router.get('/quizzes/:quizId', getQuizDetails);
router.post('/quizzes/:quizId/submit', submitQuiz);
router.post('/quizzes/:quizId/start', startQuiz);
router.get('/quizzes/attempts/:attemptId', getAttempt);
router.put('/quizzes/attempts/:attemptId/answers', saveAnswer);
router.post('/quizzes/attempts/:attemptId/submit', submitAttempt);
router.get('/quizzes/attempts/:attemptId/result', getResult);


export default router;
