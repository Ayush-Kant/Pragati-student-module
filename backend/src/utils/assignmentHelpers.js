import resolveStudentId from '../../utils/studentProfileIdentity.js';

export const normalizeError = (message, status = 500) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

export const normalizeStudentId = async (req) => {
    if (!req?.user) throw normalizeError('Authentication required', 401);
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
    submissionType: assignment.submissionType || 'both',
    starterFileUrl: assignment.starterFileUrl || null,
    latePolicy: {
        graceDays: Number(assignment.graceDays || 0),
        penaltyPerDay: Number(assignment.penaltyPerDay || 0),
    },
    allowResubmission: assignment.allowResubmission !== false,
    maxResubmissions: Number(assignment.maxResubmissions ?? 3),
    createdAt: assignment.createdAt,
    submission: assignment.submission || null,
    grade: assignment.grade || null,
    feedback: assignment.feedback || null,
});

export const buildSubmissionPayload = (submission) => ({
    id: submission.id,
    assignmentId: submission.assignmentId,
    studentId: submission.studentId,
    content: submission.content,
    fileUrl: submission.fileUrl,
    fileName: submission.fileName || null,
    fileType: submission.fileType || null,
    status: submission.status,
    lateDays: Number(submission.lateDays || 0),
    latePenalty: Number(submission.latePenalty || 0),
    attemptNumber: Number(submission.attemptNumber || 1),
    submittedAt: submission.submittedAt,
});
