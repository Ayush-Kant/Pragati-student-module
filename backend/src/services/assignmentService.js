import assignmentModel from '../models/assignmentModel.js';
import assignmentSubmissionModel from '../models/assignmentSubmissionModel.js';
import assignmentFeedbackModel from '../models/assignmentFeedbackModel.js';
import assignmentGradeModel from '../models/assignmentGradeModel.js';
import { normalizeError } from '../utils/assignmentHelpers.js';

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
            throw normalizeError('Assignment not found', 404);
        }
        return assignment;
    }

    static async updateAssignment(id, input) {
        const assignment = await assignmentModel.updateAssignment(id, input);
        if (!assignment) {
            throw normalizeError('Assignment not found', 404);
        }
        return assignment;
    }

    static async deleteAssignment(id) {
        const deleted = await assignmentModel.deleteAssignment(id);
        if (!deleted) {
            throw normalizeError('Assignment not found', 404);
        }
        return { success: true, message: 'Assignment deleted successfully' };
    }

    static async submitAssignment(assignmentId, studentId, input) {
        const assignment = await assignmentModel.getAssignmentById(assignmentId);
        if (!assignment) {
            throw normalizeError('Assignment not found', 404);
        }
        return assignmentSubmissionModel.submitAssignment(assignmentId, studentId, input);
    }

    static async getSubmission(assignmentId, studentId) {
        return assignmentSubmissionModel.getSubmissionByAssignment(assignmentId, studentId);
    }

    static async listSubmissions(filters = {}) {
        return assignmentSubmissionModel.listAllSubmissions(filters);
    }

    static async getStatistics(filters = {}) {
        return assignmentModel.getAssignmentStatistics(filters);
    }

    static async addFeedback(assignmentId, studentId, input) {
        const assignment = await assignmentModel.getAssignmentById(assignmentId);
        if (!assignment) {
            throw normalizeError('Assignment not found', 404);
        }
        return assignmentFeedbackModel.addFeedback(assignmentId, studentId, input);
    }

    static async addGrade(assignmentId, studentId, input) {
        const assignment = await assignmentModel.getAssignmentById(assignmentId);
        if (!assignment) {
            throw normalizeError('Assignment not found', 404);
        }
        return assignmentGradeModel.addGrade(assignmentId, studentId, input);
    }
}

export default AssignmentService;
