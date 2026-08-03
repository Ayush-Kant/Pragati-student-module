import { buildAssignmentPayload } from './assignmentResponse.js';

export { buildAssignmentPayload };

export const buildSubmissionPayload = (submission) => ({
    id: submission.id,
    assignmentId: submission.assignmentId,
    studentId: submission.studentId,
    content: submission.content,
    fileUrl: submission.fileUrl,
    status: submission.status,
    submittedAt: submission.submittedAt,
});

export const normalizeError = (message, status = 500) => {
    const error = new Error(message);
    error.status = status;
    return error;
};
