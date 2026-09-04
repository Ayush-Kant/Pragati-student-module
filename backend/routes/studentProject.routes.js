import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import {
  getEvaluation,
  getMilestones,
  getMilestoneSubmission,
  getProject,
  getSubmission,
  getSubmissionHistory,
  listProjects,
  submitMilestone,
  submitProject,
} from '../controllers/studentProject.controller.js';
import { deleteFile, uploadFile, uploadProjectFile } from '../controllers/studentProjectFile.controller.js';

const router = express.Router();

router.use(authMiddleware, roleMiddleware('student'));

router.get('/', listProjects);
router.get('/:projectId', getProject);
router.get('/:projectId/milestones', getMilestones);
router.get('/:projectId/milestones/:milestoneId/submission', getMilestoneSubmission);
router.post('/:projectId/milestones/:milestoneId', submitMilestone);
router.get('/:projectId/submission', getSubmission);
router.get('/:projectId/submissions', getSubmissionHistory);
router.post('/:projectId/submit', submitProject);
router.post('/:projectId/files', uploadProjectFile, uploadFile);
router.delete('/:projectId/files/:fileId', deleteFile);
router.get('/:projectId/evaluation', getEvaluation);

export default router;
