import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import {
  confirmInterview,
  getInterview,
  joinInterview,
  listInterviews,
} from '../controllers/studentInterview.controller.js';

const router = express.Router();
router.use(authMiddleware, roleMiddleware('student'));

router.get('/', listInterviews);
router.get('/:interviewId', getInterview);
router.patch('/:interviewId/confirm', confirmInterview);
router.post('/:interviewId/join', joinInterview);

export default router;
