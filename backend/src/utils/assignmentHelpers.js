import resolveStudentId from '../../utils/studentProfileIdentity.js';

export const normalizeError = (message, status = 500) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

export const normalizeStudentId = async (req) => {
    if (!req?.user) {
        throw normalizeError('Authentication required', 401);
    }

    if (req.user.role !== 'student') {
        const requested = req.query?.studentId ?? req.params?.studentId ?? req.body?.studentId;
        return requested === undefined || requested === null || requested === '' ? null : Number(requested);
    }

    return resolveStudentId(req.user);
};

export const buildAssignmentPayload = (assignment) => ({
    id: assignment.id,
    studentId: assignment.studentId,
    title: assignment.title,
    subject: assignment.subject,
    description: assignment.description,
    dueDate: assignment.dueDate,
    totalMarks: assignment.totalMarks,
    status: assignment.status,
    createdAt: assignment.createdAt,
});

export const buildSubmissionPayload = (submission) => ({
    id: submission.id,
    assignmentId: submission.assignmentId,
    studentId: submission.studentId,
    content: submission.content,
    fileUrl: submission.fileUrl,
    status: submission.status,
    submittedAt: submission.submittedAt,
});