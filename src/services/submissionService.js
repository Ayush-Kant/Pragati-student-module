class SubmissionService {
    constructor(submissionModel) {
        this.submissionModel = submissionModel;
    }

    async submitSolution(solutionData) {
        try {
            const submission = await this.submissionModel.submitSolution(solutionData);
            return submission;
        } catch (error) {
            throw new Error('Error submitting solution: ' + error.message);
        }
    }

    async getSubmissionHistory(studentId) {
        try {
            const history = await this.submissionModel.getSubmissionHistory(studentId);
            return history;
        } catch (error) {
            throw new Error('Error retrieving submission history: ' + error.message);
        }
    }

    async getSubmissionById(submissionId) {
        try {
            const submission = await this.submissionModel.getSubmissionById(submissionId);
            return submission;
        } catch (error) {
            throw new Error('Error retrieving submission: ' + error.message);
        }
    }
}

export default SubmissionService;