import express from 'express';
import authMiddleware from '../../../middleware/authMiddleware.js';
import roleMiddleware from '../../../middleware/roleMiddleware.js';
import * as controller from '../controllers/companyDashboard.controller.js';

const router = express.Router();

// Apply auth and company role check
router.use(authMiddleware, roleMiddleware('company'));

router.get('/stats', controller.getStats);
router.get('/funnel', controller.getFunnel);
router.get('/college-stats', controller.getCollegeStats);
router.get('/activity', controller.getActivity);

export default router;
