import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import {
  confirmInterview,
  getInterview,
  getInterviewOutcome,
  joinInterview,
  listInterviews,
} from '../controllers/studentInterview.controller.js';

const router = express.Router();
router.use(authMiddleware, roleMiddleware('student'));

router.get('/', listInterviews);
router.get('/:interviewId', getInterview);
// Canonical PRD method; PATCH is retained as a compatibility alias.
router.post('/:interviewId/confirm', confirmInterview);
router.patch('/:interviewId/confirm', confirmInterview);
router.post('/:interviewId/join', joinInterview);
router.get('/:interviewId/outcome', getInterviewOutcome);

export default router;
