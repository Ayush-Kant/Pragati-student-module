class LeaderboardService {
    constructor(leaderboardModel) {
        this.leaderboardModel = leaderboardModel;
    }

    async getLeaderboard() {
        try {
            const leaderboard = await this.leaderboardModel.getLeaderboard();
            return leaderboard;
        } catch (error) {
            throw new Error('Error fetching leaderboard: ' + error.message);
        }
    }

    async updateLeaderboard(studentId, score) {
        try {
            const updatedLeaderboard = await this.leaderboardModel.updateLeaderboard(studentId, score);
            return updatedLeaderboard;
        } catch (error) {
            throw new Error('Error updating leaderboard: ' + error.message);
        }
    }
}

export default LeaderboardService;