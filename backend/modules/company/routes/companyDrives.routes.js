import express from 'express';
import authMiddleware from '../../../middleware/authMiddleware.js';
import roleMiddleware from '../../../middleware/roleMiddleware.js';
import * as controller from '../controllers/companyDrives.controller.js';

const router = express.Router();

// Apply auth and company role check
router.use(authMiddleware, roleMiddleware('company'));

router.get('/', controller.listDrives);
router.post('/', controller.createDrive);
router.get('/:id', controller.getDriveById);
router.put('/:id', controller.updateDrive);
router.patch('/:id/close', controller.closeDrive);
router.patch('/:id/pause', controller.pauseDrive);
router.get('/:id/candidates', controller.listCandidates);

export default router;
