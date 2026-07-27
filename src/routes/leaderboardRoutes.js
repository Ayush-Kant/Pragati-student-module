const express = require('express');
const router = express.Router();
const LeaderboardController = require('../controllers/leaderboardController');
const { validateLeaderboard } = require('../validators/leaderboardValidator');

// Create an instance of the LeaderboardController
const leaderboardController = new LeaderboardController();

// Route to get the leaderboard
router.get('/', leaderboardController.getLeaderboard.bind(leaderboardController));

// Route to update the leaderboard
router.patch('/', validateLeaderboard, leaderboardController.updateLeaderboard.bind(leaderboardController));

module.exports = router;