import assignmentModel from '../models/assignmentModel.js';

class AssignmentService {
    static async createAssignment(input) {
        return assignmentModel.createAssignment(input);
    }

    static async listAssignments(filters = {}) {
        return assignmentModel.listAssignments(filters);
    }

    static async getAssignmentById(id) {
        const assignment = await assignmentModel.getAssignmentById(id);
        if (!assignment) {
            const error = new Error('Assignment not found');
            error.status = 404;
            throw error;
        }
        return assignment;
    }

    static async updateAssignment(id, input) {
        const assignment = await assignmentModel.updateAssignment(id, input);
        if (!assignment) {
            const error = new Error('Assignment not found');
            error.status = 404;
            throw error;
        }
        return assignment;
    }

    static async deleteAssignment(id) {
        const deleted = await assignmentModel.deleteAssignment(id);
        if (!deleted) {
            const error = new Error('Assignment not found');
            error.status = 404;
            throw error;
        }
        return { success: true, message: 'Assignment deleted successfully' };
    }

    static async submitAssignment(assignmentId, studentId, input) {
        const assignment = await assignmentModel.getAssignmentById(assignmentId);
        if (!assignment) {
            const error = new Error('Assignment not found');
            error.status = 404;
            throw error;
        }
        return assignmentModel.submitAssignment(assignmentId, studentId, input);
    }

    static async getSubmission(assignmentId, studentId) {
        return assignmentModel.getSubmissionByAssignment(assignmentId, studentId);
    }

    static async addFeedback(assignmentId, studentId, input) {
        const assignment = await assignmentModel.getAssignmentById(assignmentId);
        if (!assignment) {
            const error = new Error('Assignment not found');
            error.status = 404;
            throw error;
        }
        return assignmentModel.addFeedback(assignmentId, studentId, input);
    }

    static async addGrade(assignmentId, studentId, input) {
        const assignment = await assignmentModel.getAssignmentById(assignmentId);
        if (!assignment) {
            const error = new Error('Assignment not found');
            error.status = 404;
            throw error;
        }
        return assignmentModel.addGrade(assignmentId, studentId, input);
    }
}

export default AssignmentService;
