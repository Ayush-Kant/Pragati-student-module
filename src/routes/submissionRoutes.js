const express = require('express');
const router = express.Router();
const SubmissionController = require('../controllers/submissionController');
const { validateSubmission } = require('../validators/submissionValidator');
const authenticateJWT = require('../middleware/authenticateJWT');
const validateRequest = require('../middleware/validateRequest');

// Initialize the submission controller
const submissionController = new SubmissionController();

// Route for submitting a solution
router.post('/submit', authenticateJWT, validateRequest(validateSubmission), submissionController.submitSolution.bind(submissionController));

// Route for retrieving submission history
router.get('/submissions', authenticateJWT, submissionController.getSubmissionHistory.bind(submissionController));

// Route for retrieving a specific submission by ID
router.get('/submissions/:id', authenticateJWT, submissionController.getSubmissionById.bind(submissionController));

module.exports = router;