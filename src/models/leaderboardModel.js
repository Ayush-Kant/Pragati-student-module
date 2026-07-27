class LeaderboardModel {
    constructor(db) {
        this.db = db;
    }

    async getLeaderboard() {
        const query = 'SELECT * FROM challenge_leaderboard ORDER BY rank ASC';
        const result = await this.db.query(query);
        return result.rows;
    }

    async updateLeaderboard(studentId, score) {
        const query = `
            INSERT INTO challenge_leaderboard (student_id, score)
            VALUES ($1, $2)
            ON CONFLICT (student_id) 
            DO UPDATE SET score = GREATEST(challenge_leaderboard.score, EXCLUDED.score)
            RETURNING *`;
        const values = [studentId, score];
        const result = await this.db.query(query, values);
        return result.rows[0];
    }
}

export default LeaderboardModel;