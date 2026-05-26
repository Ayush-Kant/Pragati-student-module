import express from 'express';
const router = express.Router();

import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

import{
    getDashboardStats,
    getDashboardFunnel,
    getDashboardCompanyStats,
    getDashboardCollegePerformance,
    getDashboardActivityFeed
} from '../controllers/admin.dashboard.controller.js';

router.use(authMiddleware,roleMiddleware('admin'));
router.get('/stats',getDashboardStats);
router.get('/funnel',getDashboardFunnel);
router.get('/company-stats',getDashboardCompanyStats);
router.get('/college-performance', getDashboardCollegePerformance);
router.get('/activity-feed', getDashboardActivityFeed);

export default router;


