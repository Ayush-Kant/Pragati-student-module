import express from 'express';
import assignmentController from '../src/controllers/assignmentController.js';
import authenticateJWT from '../src/middleware/authenticateJWT.js';
import authorizeStudent from '../src/middleware/authorizeStudent.js';
import uploadMiddleware from '../src/middleware/uploadMiddleware.js';
import { validateRequest } from '../src/middleware/validateRequest.js';
import {
  assignmentIdSchema,
  submitAssignmentSchema,
} from '../src/validations/assignmentValidation.js';

const router = express.Router();
router.use(authenticateJWT, authorizeStudent);

router.get('/', assignmentController.listAssignments);
router.get('/statistics', assignmentController.getStatistics);
router.get('/submissions', assignmentController.listSubmissions);
router.get('/:id', validateRequest(assignmentIdSchema, 'params'), assignmentController.getAssignmentById);
router.post(
  '/:id/submit',
  uploadMiddleware,
  validateRequest(assignmentIdSchema, 'params'),
  validateRequest(submitAssignmentSchema, 'body'),
  assignmentController.submitAssignment,
);
router.get('/:id/submission', validateRequest(assignmentIdSchema, 'params'), assignmentController.getSubmission);

export default router;
