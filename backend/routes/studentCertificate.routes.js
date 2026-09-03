import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import {
  getCertificate,
  getEligibility,
  listCertificates,
} from '../controllers/studentCertificate.controller.js';

const router = express.Router();
router.use(authMiddleware, roleMiddleware('student'));

router.get('/', listCertificates);
router.get('/eligibility', getEligibility);
router.get('/:certificateId', getCertificate);

export default router;
