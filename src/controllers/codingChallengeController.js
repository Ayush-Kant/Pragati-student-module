// src/controllers/codingChallengeController.js

const codingChallengeService = require("../services/codingChallengeService");

const parseNumericParam = (value, name) => {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    const error = new Error(`Invalid ${name}`);
    error.status = 400;
    error.statusCode = 400;
    throw error;
  }

  return parsedValue;
};

// ==============================
// Coding Challenges
// ==============================

// GET /api/student/coding-challenges
exports.getAllChallenges = async (req, res, next) => {
  try {
    const challenges = await codingChallengeService.getChallenges();

    return res.status(200).json({
      success: true,
      message: "Coding challenges fetched successfully.",
      data: challenges,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/student/coding-challenges/:id
exports.getChallengeById = async (req, res, next) => {
  try {
    const challengeId = parseNumericParam(req.params.id, "challenge ID");
    const challenge = await codingChallengeService.getChallenge(challengeId);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Challenge fetched successfully.",
      data: challenge,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Code Execution
// ==============================

// POST /api/student/coding-challenges/:id/run
exports.executeCode = async (req, res, next) => {
  try {
    const challengeId = parseNumericParam(req.params.id, "challenge ID");
    const result = await codingChallengeService.executeCode(
      challengeId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Code executed successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/student/coding-challenges/:id/submit
exports.submitSolution = async (req, res, next) => {
  try {
    const challengeId = parseNumericParam(req.params.id, "challenge ID");
    const submission = await codingChallengeService.submitSolution(
      challengeId,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Solution submitted successfully.",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Submission History
// ==============================

// GET /api/student/coding-challenges/submissions
exports.getSubmissionHistory = async (req, res, next) => {
  try {
    const history = await codingChallengeService.getSubmissionHistory();

    return res.status(200).json({
      success: true,
      message: "Submission history fetched successfully.",
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/student/coding-challenges/submissions/:id
exports.getSubmissionById = async (req, res, next) => {
  try {
    const submissionId = parseNumericParam(req.params.id, "submission ID");
    const submission = await codingChallengeService.getSubmissionById(
      submissionId
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Submission fetched successfully.",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Test Cases
// ==============================

// GET /api/student/coding-challenges/:id/testcases
exports.getTestCases = async (req, res, next) => {
  try {
    const challengeId = parseNumericParam(req.params.id, "challenge ID");
    const testCases = await codingChallengeService.getTestCases(challengeId);

    return res.status(200).json({
      success: true,
      message: "Test cases fetched successfully.",
      data: testCases,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/student/coding-challenges/:id/testcases/hidden
exports.getHiddenTestCases = async (req, res, next) => {
  try {
    const challengeId = parseNumericParam(req.params.id, "challenge ID");
    const hiddenCases =
      await codingChallengeService.getHiddenTestCases(challengeId);

    return res.status(200).json({
      success: true,
      message: "Hidden test cases fetched successfully.",
      data: hiddenCases,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Leaderboard
// ==============================

// GET /api/student/coding-challenges/leaderboard
exports.getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await codingChallengeService.getLeaderboard();

    return res.status(200).json({
      success: true,
      message: "Leaderboard fetched successfully.",
      data: leaderboard,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/student/coding-challenges/leaderboard
exports.updateLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await codingChallengeService.updateLeaderboard(
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Leaderboard updated successfully.",
      data: leaderboard,
    });
  } catch (error) {
    next(error);
  }
};