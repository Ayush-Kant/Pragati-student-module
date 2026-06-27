import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import {
  listNotificationsController,
  sendNotificationController,
  scheduleNotificationController,
  listTemplatesController,
  createTemplateController,
  getNotificationByIdController,
} from '../controllers/admin.notification.controller.js';
import {
  validateSendNotification,
  validateScheduleNotification,
  validateTemplate,
} from '../validators/admin.notification.validator.js';

const router = express.Router();

router.use(authMiddleware, roleMiddleware('admin'));

router.get('/', listNotificationsController);
router.post('/send', validateSendNotification, sendNotificationController);
router.post('/schedule', validateScheduleNotification, scheduleNotificationController);
router.get('/templates', listTemplatesController);
router.post('/templates', validateTemplate, createTemplateController);
router.get('/:id', getNotificationByIdController);

export default router;
