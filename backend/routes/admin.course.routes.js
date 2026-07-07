// admin.course.routes.js

import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import * as validator from '../validators/admin.course.validator.js';
import * as controller from '../controllers/admin.course.controller.js';

const router = express.Router();

router.use(authMiddleware, roleMiddleware('admin'));

router.get('/', controller.listCourses);
router.get('/stats', controller.getTrainingStats);
router.get('/:id', controller.getCourseById);
router.put('/:id/status', validator.validateCourseStatus, controller.updateCourseStatus);

export default router;
