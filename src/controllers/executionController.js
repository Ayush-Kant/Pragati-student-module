class ExecutionController {
    constructor(executionService) {
        this.executionService = executionService;
    }

    async executeCode(req, res) {
        try {
            const { id } = req.params;
            const { code, language } = req.body;

            const result = await this.executionService.executeCode(id, code, language);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getExecutionResult(req, res) {
        try {
            const { id } = req.params;

            const result = await this.executionService.getExecutionResult(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default ExecutionController;