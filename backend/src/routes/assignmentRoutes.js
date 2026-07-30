import express from 'express';
import assignmentController from '../controllers/assignmentController.js';
import authMiddleware from '../../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
    createAssignmentSchema,
    updateAssignmentSchema,
    submitAssignmentSchema,
    assignmentIdSchema,
    feedbackSchema,
    gradeSchema,
} from '../validators/assignmentValidator.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', validateRequest(createAssignmentSchema, 'body'), assignmentController.createAssignment);
router.get('/', assignmentController.listAssignments);
router.get('/:id', validateRequest(assignmentIdSchema, 'params'), assignmentController.getAssignmentById);
router.patch('/:id', validateRequest(assignmentIdSchema, 'params'), validateRequest(updateAssignmentSchema, 'body'), assignmentController.updateAssignment);
router.delete('/:id', validateRequest(assignmentIdSchema, 'params'), assignmentController.deleteAssignment);
router.post('/:id/submit', validateRequest(assignmentIdSchema, 'params'), validateRequest(submitAssignmentSchema, 'body'), assignmentController.submitAssignment);
router.get('/:id/submission', validateRequest(assignmentIdSchema, 'params'), assignmentController.getSubmission);
router.post('/:id/feedback/:studentId', validateRequest(assignmentIdSchema, 'params'), validateRequest(feedbackSchema, 'body'), assignmentController.addFeedback);
router.post('/:id/grade/:studentId', validateRequest(assignmentIdSchema, 'params'), validateRequest(gradeSchema, 'body'), assignmentController.addGrade);

export default router;
