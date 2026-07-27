const express = require('express');
const router = express.Router();
const TestCaseController = require('../controllers/testcaseController');
const validateRequest = require('../middleware/validateRequest');
const { validateTestCase } = require('../validators/testcaseValidator');

// Create an instance of the TestCaseController
const testcaseController = new TestCaseController();

// Route to get all public test cases for a specific challenge
router.get('/:id/testcases', testcaseController.getTestCases);

// Route to get hidden test cases for a specific challenge
router.get('/:id/testcases/hidden', testcaseController.getHiddenTestCases);

module.exports = router;