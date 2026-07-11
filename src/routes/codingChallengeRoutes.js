const express = require("express");
const router = express.Router();

const codingChallengeController = require("../controllers/codingChallengeController");

// GET /api/student/coding-challenges
router.get("/", codingChallengeController.getAllChallenges);

// GET /api/student/coding-challenges/submissions
router.get("/submissions", codingChallengeController.getSubmissionHistory);

// GET /api/student/coding-challenges/submissions/:id
router.get("/submissions/:id", codingChallengeController.getSubmissionById);

// GET /api/student/coding-challenges/leaderboard
router.get("/leaderboard", codingChallengeController.getLeaderboard);

// PATCH /api/student/coding-challenges/leaderboard
router.patch("/leaderboard", codingChallengeController.updateLeaderboard);

// GET /api/student/coding-challenges/:id
router.get("/:id", codingChallengeController.getChallengeById);

// POST /api/student/coding-challenges/:id/run
router.post("/:id/run", codingChallengeController.executeCode);

// POST /api/student/coding-challenges/:id/submit
router.post("/:id/submit", codingChallengeController.submitSolution);

// GET /api/student/coding-challenges/:id/testcases
router.get("/:id/testcases", codingChallengeController.getTestCases);

// GET /api/student/coding-challenges/:id/testcases/hidden
router.get("/:id/testcases/hidden", codingChallengeController.getHiddenTestCases);

module.exports = router;