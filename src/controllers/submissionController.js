class SubmissionController {
    constructor(submissionService) {
        this.submissionService = submissionService;
    }

    async submitSolution(req, res) {
        try {
            const submissionData = req.body;
            const result = await this.submissionService.submitSolution(submissionData);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getSubmissionHistory(req, res) {
        try {
            const studentId = req.params.studentId;
            const history = await this.submissionService.getSubmissionHistory(studentId);
            res.status(200).json(history);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getSubmissionById(req, res) {
        try {
            const submissionId = req.params.id;
            const submission = await this.submissionService.getSubmissionById(submissionId);
            if (submission) {
                res.status(200).json(submission);
            } else {
                res.status(404).json({ message: 'Submission not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default SubmissionController;