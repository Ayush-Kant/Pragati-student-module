// src/validators/codingChallengeValidator.js

const { body, validationResult } = require("express-validator");

// ===============================
// Challenge Validation
// ===============================

const validateChallenge = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required"),

  body("difficulty")
    .notEmpty()
    .withMessage("Difficulty is required")
    .isIn(["Easy", "Medium", "Hard"])
    .withMessage("Difficulty must be Easy, Medium, or Hard"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required"),

  body("points")
    .notEmpty()
    .withMessage("Points are required")
    .isNumeric()
    .withMessage("Points must be numeric"),
];

// ===============================
// Submission Validation
// ===============================

const validateSubmission = [
  body("studentId")
    .notEmpty()
    .withMessage("Student ID is required")
    .isNumeric()
    .withMessage("Student ID must be numeric"),

  body("language")
    .notEmpty()
    .withMessage("Language is required"),

  body("sourceCode")
    .notEmpty()
    .withMessage("Source code is required")
    .isLength({ min: 5 })
    .withMessage("Source code is too short"),
];

// ===============================
// Code Execution Validation
// ===============================

const validateExecution = [
  body("language")
    .notEmpty()
    .withMessage("Language is required"),

  body("sourceCode")
    .notEmpty()
    .withMessage("Source code is required"),
];

// ===============================
// Language Validation
// ===============================

const validateLanguage = [
  body("language")
    .isIn([
      "javascript",
      "python",
      "java",
      "cpp",
      "c",
      "go",
      "typescript"
    ])
    .withMessage("Unsupported programming language"),
];

// ===============================
// Input Sanitization
// ===============================

const sanitizeInput = (req, res, next) => {

  if (req.body.title) {
    req.body.title = req.body.title.trim();
  }

  if (req.body.category) {
    req.body.category = req.body.category.trim();
  }

  if (req.body.language) {
    req.body.language = req.body.language.trim().toLowerCase();
  }

  if (req.body.sourceCode) {
    req.body.sourceCode = req.body.sourceCode.trim();
  }

  next();
};

// ===============================
// Validation Result
// ===============================

const validateRequest = (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });

  }

  next();
};

module.exports = {
  validateChallenge,
  validateSubmission,
  validateExecution,
  validateLanguage,
  sanitizeInput,
  validateRequest,
};