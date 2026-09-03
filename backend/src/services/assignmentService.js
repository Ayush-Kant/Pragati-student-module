import assignmentModel from '../models/assignmentModel.js';
import assignmentSubmissionModel from '../models/assignmentSubmissionModel.js';
import assignmentFeedbackModel from '../models/assignmentFeedbackModel.js';
import assignmentGradeModel from '../models/assignmentGradeModel.js';
import { normalizeError } from '../utils/assignmentHelpers.js';
import notificationService from '../../services/notification.service.js';

class AssignmentService {
    static async createAssignment(input) {
        const assignment = await assignmentModel.createAssignment(input);
        try {
            const payload = {
                title: `New assignment: ${assignment.title}`,
                message: `${assignment.subject || 'Coursework'} has a new assignment${assignment.dueDate ? ` due ${new Date(assignment.dueDate).toLocaleString()}` : ''}.`,
                type: notificationService.NOTIFICATION_TYPES.ASSIGNMENT_PUBLISHED,
                linkUrl: `/student/assignments/${assignment.id}`,
            };
            if (assignment.studentId) {
                await notificationService.sendNotificationToStudents({ studentIds: [assignment.studentId], ...payload });
            } else {
                await notificationService.sendNotification({ role: 'student', ...payload });
            }
        } catch (error) {
            console.error('[assignment] Failed to dispatch assignment notification:', error.message);
        }
        return assignment;
    }

    static async listAssignments(filters = {}) {
        return assignmentModel.listAssignments(filters);
    }

    static async getAssignmentById(id, studentId = null) {
        const assignment = await assignmentModel.getAssignmentById(id, studentId);
        if (!assignment) throw normalizeError('Assignment not found', 404);
        return assignment;
    }

    static async updateAssignment(id, input) {
        const assignment = await assignmentModel.updateAssignment(id, input);
        if (!assignment) throw normalizeError('Assignment not found', 404);
        return assignment;
    }

    static async deleteAssignment(id) {
        const deleted = await assignmentModel.deleteAssignment(id);
        if (!deleted) throw normalizeError('Assignment not found', 404);
        return { success: true, message: 'Assignment deleted successfully' };
    }

    static async submitAssignment(assignmentId, studentId, input) {
        const assignment = await assignmentModel.getAssignmentById(assignmentId, studentId);
        if (!assignment) throw normalizeError('Assignment not found', 404);
        return assignmentSubmissionModel.submitAssignment(assignmentId, studentId, input);
    }

    static async getSubmission(assignmentId, studentId) {
        const assignment = await assignmentModel.getAssignmentById(assignmentId, studentId);
        if (!assignment) throw normalizeError('Assignment not found', 404);
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
        if (!assignment) throw normalizeError('Assignment not found', 404);
        return assignmentFeedbackModel.addFeedback(assignmentId, studentId, input);
    }

    static async addGrade(assignmentId, studentId, input) {
        const assignment = await assignmentModel.getAssignmentById(assignmentId);
        if (!assignment) throw normalizeError('Assignment not found', 404);

        const score = Number(input?.score);
        const totalMarks = Number(assignment.totalMarks);
        if (!Number.isFinite(score) || score < 0 || score > totalMarks) {
            throw normalizeError(`Score must be between 0 and ${totalMarks}`, 422);
        }

        const grade = await assignmentGradeModel.addGrade(assignmentId, studentId, {
            ...input,
            score,
        });
        try {
            await notificationService.sendNotificationToStudents({
                studentIds: [studentId],
                title: `Grade released: ${assignment.title}`,
                message: `Your assignment has been graded: ${grade.score}/${assignment.totalMarks}.`,
                type: notificationService.NOTIFICATION_TYPES.GRADE_RELEASED,
                linkUrl: `/student/assignments/${assignmentId}`,
            });
        } catch (error) {
            console.error('[assignment] Failed to dispatch grade notification:', error.message);
        }
        return grade;
    }
}

export default AssignmentService;
