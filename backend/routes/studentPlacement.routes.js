import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import controller from '../controllers/studentPlacement.controller.js';

const router = express.Router();

router.use(authMiddleware, roleMiddleware('student'));

router.get('/dashboard', controller.getDashboard);
router.get('/applications', controller.getApplications);
router.get('/applications/:applicationId', controller.getApplicationById);
router.post('/applications', controller.createApplication);
router.patch('/applications/:applicationId/status', controller.updateApplicationStatus);
router.delete('/applications/:applicationId', controller.withdrawApplication);
router.get('/interviews', controller.getInterviews);
router.get('/skills', controller.getSkills);
router.get('/skills/gaps', controller.getSkillGaps);
router.get('/analytics', controller.getAnalytics);
router.get('/recommendations', controller.getRecommendations);

export default router;
