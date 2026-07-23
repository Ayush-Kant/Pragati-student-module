import express from 'express';
import authMiddleware from '../../../middleware/authMiddleware.js';
import roleMiddleware from '../../../middleware/roleMiddleware.js';
import * as controller from '../controllers/companyCandidate.controller.js';

const router = express.Router();

// Apply auth and company role checks to all candidate endpoints
router.use(authMiddleware, roleMiddleware('company'));

router.get('/', controller.getCandidates);
router.get('/export', controller.exportCandidates);
router.patch('/bulk-shortlist', controller.bulkShortlistCandidates);
router.patch('/bulk-reject', controller.bulkRejectCandidates);
router.patch('/bulk-movestage', controller.bulkMoveCandidatesStage);
router.get('/:id', controller.getCandidateById);
router.patch('/:id/shortlist', controller.shortlistCandidate);
router.patch('/:id/reject', controller.rejectCandidate);
router.patch('/:id/movestage', controller.moveCandidateStage);

export default router;
