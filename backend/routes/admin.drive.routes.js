// admin.drive.routes.js

import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import * as validator from '../validators/admin.drive.validator.js';
import * as controller from '../controllers/admin.drive.controller.js';

const router = express.Router();

router.use(authMiddleware, roleMiddleware('admin'));

router.get('/',                       controller.listDrives);
router.post('/',                      validator.validateCreateDrive,   controller.createDrive);
router.get('/:id',                    controller.getDriveById);
router.put('/:id',                    controller.updateDrive);
router.patch('/:id/advance',          controller.advanceDrive);
router.patch('/:id/freeze',           controller.freezeDrive);
router.patch('/:id/unfreeze',         controller.unfreezeDrive);
router.get('/:id/candidates',         controller.getCandidates);
router.patch('/:id/move-candidate',   validator.validateMoveCandidate, controller.moveCandidate);
router.patch('/:id/shortlist',        validator.validateShortlist,     controller.shortlistCandidates);
router.post('/:id/assign-test',       validator.validateAssignTest,    controller.assignTest);
router.post('/:id/assign-course',     validator.validateAssignCourse,  controller.assignCourse);

export default router;
