export const normalizeError = (message, status = 500) => {
    const error = new Error(message);
    error.status = status;
    return error;
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
