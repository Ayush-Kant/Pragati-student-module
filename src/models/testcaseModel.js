class TestCaseModel {
    constructor(db) {
        this.db = db;
    }

    async getTestCases(challengeId) {
        const query = 'SELECT * FROM test_cases WHERE challenge_id = $1';
        const result = await this.db.query(query, [challengeId]);
        return result.rows;
    }

    async getHiddenTestCases(challengeId) {
        const query = 'SELECT * FROM test_cases WHERE challenge_id = $1 AND visibility = $2';
        const result = await this.db.query(query, [challengeId, 'Hidden']);
        return result.rows;
    }
}

export default TestCaseModel;