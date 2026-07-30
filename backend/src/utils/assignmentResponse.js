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
