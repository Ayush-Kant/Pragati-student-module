class SubmissionModel {
    constructor(db) {
        this.db = db;
    }

    async submitSolution(submissionData) {
        const { challengeId, studentId, code, language } = submissionData;
        const result = await this.db.query(
            'INSERT INTO challenge_submissions (challenge_id, student_id, code, language) VALUES ($1, $2, $3, $4) RETURNING *',
            [challengeId, studentId, code, language]
        );
        return result.rows[0];
    }

    async getSubmissionHistory(studentId) {
        const result = await this.db.query(
            'SELECT * FROM challenge_submissions WHERE student_id = $1',
            [studentId]
        );
        return result.rows;
    }

    async getSubmissionById(submissionId) {
        const result = await this.db.query(
            'SELECT * FROM challenge_submissions WHERE id = $1',
            [submissionId]
        );
        return result.rows[0];
    }
}

export default SubmissionModel;