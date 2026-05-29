// company.routes.js

import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { validateRejectBody, validateSuspendBody } from '../validators/company.validator.js';
import * as controller from '../controllers/company.controller.js';

const router = express.Router();

router.use(authMiddleware, roleMiddleware('admin'));

// ⚠️  /rankings and /active-drives MUST come before /:id to avoid route conflicts
router.get('/',               controller.listCompanies);
router.get('/rankings',       controller.getCompanyRankings);
router.get('/active-drives',  controller.getActiveDrives);

router.get('/:id',            controller.getCompanyById);
router.get('/:id/stats',      controller.getCompanyStats);
router.get('/:id/drives',     controller.getCompanyDrives);

router.post('/:id/approve',   controller.approveCompany);
router.post('/:id/reject',    validateRejectBody,  controller.rejectCompany);
router.post('/:id/suspend',   validateSuspendBody, controller.suspendCompany);
router.post('/:id/reinstate', controller.reinstateCompany);

export default router;
