// src/services/codingChallengeService.js

const codingChallengeModel = require("../models/codingChallengeModel");

class CodingChallengeService {

    // ==========================
    // Coding Challenges
    // ==========================

    async getChallenges() {
        try {
            return await codingChallengeModel.getAllChallenges();
        } catch (error) {
            throw new Error("Error fetching challenges: " + error.message);
        }
    }

    async getChallenge(id) {
        try {
            const challenge = await codingChallengeModel.getChallengeById(id);

            if (!challenge) {
                throw new Error("Challenge not found");
            }

            return challenge;
        } catch (error) {
            throw new Error("Error fetching challenge: " + error.message);
        }
    }

    // ==========================
    // Code Execution
    // ==========================

    async executeCode(challengeId, data) {
        try {
            return await codingChallengeModel.executeCode(challengeId, data);
        } catch (error) {
            throw new Error("Error executing code: " + error.message);
        }
    }

    async submitSolution(challengeId, data) {
        try {
            return await codingChallengeModel.submitSolution(challengeId, data);
        } catch (error) {
            throw new Error("Error submitting solution: " + error.message);
        }
    }

    // ==========================
    // Submission History
    // ==========================

    async getSubmissionHistory() {
        try {
            return await codingChallengeModel.getSubmissionHistory();
        } catch (error) {
            throw new Error("Error fetching submission history: " + error.message);
        }
    }

    async getSubmissionById(id) {
        try {
            const submission = await codingChallengeModel.getSubmissionById(id);

            if (!submission) {
                throw new Error("Submission not found");
            }

            return submission;
        } catch (error) {
            throw new Error("Error fetching submission: " + error.message);
        }
    }

    // ==========================
    // Test Cases
    // ==========================

    async getTestCases(challengeId) {
        try {
            return await codingChallengeModel.getTestCases(challengeId);
        } catch (error) {
            throw new Error("Error fetching test cases: " + error.message);
        }
    }

    async getHiddenTestCases(challengeId) {
        try {
            return await codingChallengeModel.getHiddenTestCases(challengeId);
        } catch (error) {
            throw new Error("Error fetching hidden test cases: " + error.message);
        }
    }

    // ==========================
    // Leaderboard
    // ==========================

    async getLeaderboard() {
        try {
            return await codingChallengeModel.getLeaderboard();
        } catch (error) {
            throw new Error("Error fetching leaderboard: " + error.message);
        }
    }

    async updateLeaderboard(data) {
        try {
            return await codingChallengeModel.updateLeaderboard(data);
        } catch (error) {
            throw new Error("Error updating leaderboard: " + error.message);
        }
    }
}

module.exports = new CodingChallengeService();