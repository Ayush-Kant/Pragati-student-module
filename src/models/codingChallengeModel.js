// src/models/codingChallengeModel.js

const db = require("../config/db");

class CodingChallengeModel {

    // ==========================
    // Coding Challenges
    // ==========================

    async getAllChallenges() {
        const query = `
            SELECT *
            FROM coding_challenges
            ORDER BY id ASC
        `;

        const result = await db.query(query);
        return result.rows;
    }

    async getChallengeById(id) {
        const query = `
            SELECT *
            FROM coding_challenges
            WHERE id = $1
        `;

        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    // ==========================
    // Code Execution
    // ==========================

    async executeCode(challengeId, data) {
        // Judge0 integration goes in the service layer.
        return {
            challengeId,
            language: data.language,
            sourceCode: data.sourceCode,
            status: "Executed"
        };
    }

    // ==========================
    // Submission
    // ==========================

    async submitSolution(challengeId, data) {
        const query = `
            INSERT INTO challenge_submissions
            (student_id, challenge_id, language, source_code, status)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;

        const values = [
            data.studentId,
            challengeId,
            data.language,
            data.sourceCode,
            "Submitted"
        ];

        const result = await db.query(query, values);

        return result.rows[0];
    }

    async getSubmissionHistory() {
        const query = `
            SELECT *
            FROM challenge_submissions
            ORDER BY created_at DESC
        `;

        const result = await db.query(query);

        return result.rows;
    }

    async getSubmissionById(id) {
        const query = `
            SELECT *
            FROM challenge_submissions
            WHERE id = $1
        `;

        const result = await db.query(query, [id]);

        return result.rows[0];
    }

    // ==========================
    // Test Cases
    // ==========================

    async getTestCases(challengeId) {
        const query = `
            SELECT *
            FROM test_cases
            WHERE challenge_id = $1
            AND visibility = 'Public'
        `;

        const result = await db.query(query, [challengeId]);

        return result.rows;
    }

    async getHiddenTestCases(challengeId) {
        const query = `
            SELECT *
            FROM test_cases
            WHERE challenge_id = $1
            AND visibility = 'Hidden'
        `;

        const result = await db.query(query, [challengeId]);

        return result.rows;
    }

    // ==========================
    // Leaderboard
    // ==========================

    async getLeaderboard() {
        const query = `
            SELECT *
            FROM challenge_leaderboard
            ORDER BY score DESC
        `;

        const result = await db.query(query);

        return result.rows;
    }

    async updateLeaderboard(data) {
        const query = `
            UPDATE challenge_leaderboard
            SET score = $1,
                rank = $2
            WHERE student_id = $3
            RETURNING *
        `;

        const values = [
            data.score,
            data.rank,
            data.studentId
        ];

        const result = await db.query(query, values);

        return result.rows[0];
    }

}

module.exports = new CodingChallengeModel();