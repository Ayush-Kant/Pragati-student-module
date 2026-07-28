class TestCaseService {
    constructor(testCaseModel) {
        this.testCaseModel = testCaseModel;
    }

    async getTestCases(challengeId) {
        try {
            const testCases = await this.testCaseModel.getTestCases(challengeId);
            return testCases;
        } catch (error) {
            throw new Error('Error retrieving test cases: ' + error.message);
        }
    }

    async getHiddenTestCases(challengeId) {
        try {
            const hiddenTestCases = await this.testCaseModel.getHiddenTestCases(challengeId);
            return hiddenTestCases;
        } catch (error) {
            throw new Error('Error retrieving hidden test cases: ' + error.message);
        }
    }
}

export default TestCaseService;