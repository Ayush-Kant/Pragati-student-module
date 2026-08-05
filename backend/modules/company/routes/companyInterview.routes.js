import express from 'express';
import authMiddleware from '../../../middleware/authMiddleware.js';
import roleMiddleware from '../../../middleware/roleMiddleware.js';
import * as controller from '../controllers/companyInterview.controller.js';

const router = express.Router();

// Apply auth and company checks
router.use(authMiddleware, roleMiddleware('company'));

router.get('/', controller.getInterviews);
router.post('/', controller.createInterview);
router.get('/:id', controller.getInterviewById);
router.patch('/:id/feedback', controller.submitFeedback);
router.patch('/:id/result', controller.updateResult);

export default router;
