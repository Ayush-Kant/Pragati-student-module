import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import '../services/studentCodingExecution.bootstrap.js';
import {
  getChallenge,
  getLeaderboard,
  getSubmissionHistory,
  listChallenges,
  runCode,
  submitSolution,
} from '../controllers/studentCoding.controller.js';

const router = express.Router();
router.use(authMiddleware, roleMiddleware('student'));

router.get('/', listChallenges);
router.get('/leaderboard', getLeaderboard);
router.get('/submissions', getSubmissionHistory);
router.get('/:challengeId', getChallenge);
router.post('/:challengeId/run', runCode);
router.post('/:challengeId/submit', submitSolution);
router.get('/:challengeId/submissions', getSubmissionHistory);
router.get('/:challengeId/leaderboard', getLeaderboard);

export default router;
