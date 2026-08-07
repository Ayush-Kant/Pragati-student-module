const express = require('express');
const router = express.Router();
const ExecutionController = require('../controllers/executionController');
const { validateExecution } = require('../validators/executionValidator');

// Create an instance of the ExecutionController
const executionController = new ExecutionController();

// Route for executing code
router.post('/coding-challenges/:id/run', validateExecution, executionController.executeCode.bind(executionController));

// Route for retrieving execution results
router.get('/coding-challenges/:id/execution-results', executionController.getExecutionResult.bind(executionController));

module.exports = router;