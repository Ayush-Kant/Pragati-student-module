// admin.college.routes.js
 
import express from 'express'

import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import * as validator from '../validators/admin.college.validator.js'
import * as controller from '../controllers/admin.college.controller.js'

const router  = express.Router();
 
router.use(authMiddleware, roleMiddleware('admin'));
 
router.get('/',                      controller.listColleges);
router.get('/rankings',              controller.getCollegeRankings);
router.get('/needs-recruitment',     controller.getCollegesNeedingDrives);
router.get('/:id',                   controller.getCollegeById);
router.get('/:id/stats',             controller.getCollegeStats);
router.put('/:id/approve',           controller.approveCollege);
router.put('/:id/reject',            validator.validateRejectBody,   controller.rejectCollege);
router.put('/:id/suspend',           validator.validateSuspendBody,  controller.suspendCollege);
 
export default router;