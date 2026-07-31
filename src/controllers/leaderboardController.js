class LeaderboardController {
    constructor(leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    async getLeaderboard(req, res) {
        try {
            const leaderboard = await this.leaderboardService.getLeaderboard();
            res.status(200).json(leaderboard);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving leaderboard', error: error.message });
        }
    }

    async updateLeaderboard(req, res) {
        try {
            const updatedLeaderboard = await this.leaderboardService.updateLeaderboard(req.body);
            res.status(200).json(updatedLeaderboard);
        } catch (error) {
            res.status(500).json({ message: 'Error updating leaderboard', error: error.message });
        }
    }
}

export default LeaderboardController;