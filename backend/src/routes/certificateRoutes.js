import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  getCertificates,
  getCertificateById,
  generateCertificate,
  verifyCertificate,
  getAchievements,
  getBadges,
  getCertificateStatistics,
  getAchievementSummary,
  getBadgeCount,
  getCompletionInsights,
} from '../controllers/certificateController.js';
import { generateCertificateSchema, verificationRequestSchema } from '../validations/certificateValidation.js';

const router = express.Router();

// Student certificate endpoints
router.get('/certificates', authMiddleware, getCertificates);
router.get('/certificates/statistics', authMiddleware, getCertificateStatistics);
router.post('/certificates/generate', authMiddleware, validateRequest(generateCertificateSchema), generateCertificate);
router.get('/certificates/:certificateId', authMiddleware, getCertificateById);
router.get('/certificates/:certificateId/verify', validateRequest(verificationRequestSchema, 'query'), verifyCertificate);

// Student achievement and badge endpoints
router.get('/achievements', authMiddleware, getAchievements);
router.get('/achievements/summary', authMiddleware, getAchievementSummary);
router.get('/badges', authMiddleware, getBadges);
router.get('/badges/count', authMiddleware, getBadgeCount);

// Dashboard-style insights
router.get('/completion-insights', authMiddleware, getCompletionInsights);

export default router;
