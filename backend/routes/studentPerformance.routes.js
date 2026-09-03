import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { getPerformance, getSubmissionHistory } from '../controllers/studentPerformance.controller.js';

const router = express.Router();
router.use(authMiddleware, roleMiddleware('student'));

// Summary for the authenticated student; optionally scoped to an enrolled drive.
router.get('/', getPerformance);
router.get('/:driveId', getPerformance);

// PRD: drill down into individual activity submission history.
router.get('/submissions/history', getSubmissionHistory);
router.get('/submissions', getSubmissionHistory);

export default router;
