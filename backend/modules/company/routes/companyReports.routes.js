import express from 'express';
import authMiddleware from '../../../middleware/authMiddleware.js';
import roleMiddleware from '../../../middleware/roleMiddleware.js';
import * as controller from '../controllers/companyReports.controller.js';

const router = express.Router();

// Apply auth and company role check
router.use(authMiddleware, roleMiddleware('company'));

router.get('/kpis', controller.getKPIs);
router.get('/funnel', controller.getFunnel);
router.get('/trends', controller.getTrends);
router.get('/college-performance', controller.getCollegePerformance);
router.get('/export', controller.exportPerformanceReport);

export default router;
