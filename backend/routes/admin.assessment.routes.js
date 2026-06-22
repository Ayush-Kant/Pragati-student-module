import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import {
  createAssessment,
  getAssessments,
  getAssessmentById,
  updateAssessment,
  publishAssessment,
  archiveAssessment,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  assignDrive
} from '../controllers/admin.assessment.controller.js';
import {
  validateCreateAssessment,
  validateCreateQuestion,
  validateAssignAssessment
} from '../validators/admin.assessment.validator.js';

const router = express.Router();

// Protect all admin assessment routes
// Only logged in admins should be able to access these
router.use(authMiddleware, roleMiddleware('admin'));

// Assessment Core Routes
router.post('/', validateCreateAssessment, createAssessment);
router.get('/', getAssessments); // lists all with filters/pagination
router.get('/:id', getAssessmentById);
router.put('/:id', updateAssessment);
router.delete('/:id', archiveAssessment); // soft delete

// Question Management Routes
router.post('/:id/questions', validateCreateQuestion, addQuestion);
router.put('/:id/questions/:qid', updateQuestion);
router.delete('/:id/questions/:qid', deleteQuestion);

// Actions
router.patch('/:id/publish', publishAssessment); // make it active
router.patch('/:id/assign', validateAssignAssessment, assignDrive); // link to a drive

export default router;
