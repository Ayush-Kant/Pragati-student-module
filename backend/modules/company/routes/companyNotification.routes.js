import express from 'express';
import authMiddleware from '../../../middleware/authMiddleware.js';
import roleMiddleware from '../../../middleware/roleMiddleware.js';
import * as controller from '../controllers/companyNotification.controller.js';

const router = express.Router();

router.use(authMiddleware, roleMiddleware('company'));

router.get('/',              controller.getNotifications);
router.post('/send',         controller.sendNotification);
router.post('/schedule',     controller.scheduleNotification);

export default router;
