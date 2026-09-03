import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { getPerformance } from '../controllers/studentPerformance.controller.js';

const router = express.Router();
router.use(authMiddleware, roleMiddleware('student'));
router.get('/', getPerformance);

export default router;
