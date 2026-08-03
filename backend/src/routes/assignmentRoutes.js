import express from 'express';
import assignmentController from '../controllers/assignmentController.js';
import authMiddleware from '../../middleware/authMiddleware.js';
import uploadMiddleware from '../middleware/uploadMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
    createAssignmentSchema,
    updateAssignmentSchema,
    submitAssignmentSchema,
    assignmentIdSchema,
    assignmentIdAndStudentIdSchema,
    feedbackSchema,
    gradeSchema,
} from '../validations/assignmentValidation.js';

const router = express.Router();

router.use(authMiddleware);

// Base queries & statistics
router.post('/', validateRequest(createAssignmentSchema, 'body'), assignmentController.createAssignment);
router.get('/', assignmentController.listAssignments);
router.get('/statistics', assignmentController.getStatistics);
router.get('/submissions', assignmentController.listSubmissions);

// Specific assignment operations
router.get('/:id', validateRequest(assignmentIdSchema, 'params'), assignmentController.getAssignmentById);
router.patch('/:id', validateRequest(assignmentIdSchema, 'params'), validateRequest(updateAssignmentSchema, 'body'), assignmentController.updateAssignment);
router.delete('/:id', validateRequest(assignmentIdSchema, 'params'), assignmentController.deleteAssignment);

router.post(
    '/:id/submit',
    uploadMiddleware,
    (req, res, next) => {
        if (req.file && !req.body?.fileUrl) {
            req.body = req.body || {};
            req.body.fileUrl = `http://localhost/uploads/${req.file.originalname}`;
        }
        next();
    },
    validateRequest(assignmentIdSchema, 'params'),
    validateRequest(submitAssignmentSchema, 'body'),
    assignmentController.submitAssignment
);

router.get('/:id/submission', validateRequest(assignmentIdSchema, 'params'), assignmentController.getSubmission);
router.post('/:id/feedback/:studentId', validateRequest(assignmentIdAndStudentIdSchema, 'params'), validateRequest(feedbackSchema, 'body'), assignmentController.addFeedback);
router.post('/:id/grade/:studentId', validateRequest(assignmentIdAndStudentIdSchema, 'params'), validateRequest(gradeSchema, 'body'), assignmentController.addGrade);

export default router;
