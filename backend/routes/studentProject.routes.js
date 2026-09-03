import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import {
  getEvaluation,
  getMilestones,
  getProject,
  getSubmission,
  getSubmissionHistory,
  listProjects,
  submitProject,
} from '../controllers/studentProject.controller.js';

const router = express.Router();

router.use(authMiddleware, roleMiddleware('student'));

router.get('/', listProjects);
router.get('/:projectId', getProject);
router.get('/:projectId/milestones', getMilestones);
router.get('/:projectId/submission', getSubmission);
router.get('/:projectId/submissions', getSubmissionHistory);
router.post('/:projectId/submit', submitProject);
router.get('/:projectId/evaluation', getEvaluation);

export default router;
