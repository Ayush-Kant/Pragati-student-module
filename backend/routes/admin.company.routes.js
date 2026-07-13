// admin.company.routes.js

import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

import * as validator from '../validators/admin.company.validator.js';
import * as controller from '../controllers/admin.company.controller.js';

const router = express.Router();

router.use(authMiddleware,roleMiddleware('admin'));

router.get('/',validator.validatePagination,controller.getAllCompanies);

router.get('/rankings',controller.getCompanyRankings);

router.get('/active-drives',controller.getActiveDriveCompanies);


router.get('/:id',validator.validateCompanyId,controller.getCompanyById);

router.get('/:id/stats',validator.validateCompanyId,controller.getCompanyStats);

router.get('/:id/drives',validator.validateCompanyId,controller.getCompanyDrives);

router.put('/:id/approve',validator.validateCompanyId,controller.approveCompany);

router.put('/:id/reject',validator.validateCompanyId,validator.validateRejectBody,controller.rejectCompany);

router.put('/:id/suspend',validator.validateCompanyId,validator.validateSuspendBody,controller.suspendCompany);

router.put('/:id/reinstate',validator.validateCompanyId,controller.reinstateCompany);

export default router;