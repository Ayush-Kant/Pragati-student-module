class TestCaseController {
    constructor(testCaseService) {
        this.testCaseService = testCaseService;
    }

    async getTestCases(req, res) {
        try {
            const challengeId = req.params.id;
            const testCases = await this.testCaseService.getTestCases(challengeId);
            res.status(200).json(testCases);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving test cases", error: error.message });
        }
    }

    async getHiddenTestCases(req, res) {
        try {
            const challengeId = req.params.id;
            const hiddenTestCases = await this.testCaseService.getHiddenTestCases(challengeId);
            res.status(200).json(hiddenTestCases);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving hidden test cases", error: error.message });
        }
    }
}

export default TestCaseController;