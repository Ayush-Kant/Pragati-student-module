import { pool } from '../../config/db.js';

const normalizeAssignmentRecord = (row) => ({
    id: row.id,
    studentId: row.student_id,
    title: row.title,
    subject: row.subject,
    description: row.description,
    dueDate: row.due_date,
    totalMarks: row.total_marks,
    status: row.status,
    createdAt: row.created_at,
});

const normalizeSubmissionRecord = (row) => ({
    id: row.id,
    assignmentId: row.assignment_id,
    studentId: row.student_id,
    content: row.content,
    fileUrl: row.file_url,
    status: row.status,
    submittedAt: row.submitted_at,
});

export const createAssignment = async (assignmentData) => {
    const { studentId, title, subject, description, dueDate, totalMarks, status } = assignmentData;
    const result = await pool.query(
        `INSERT INTO assignments (student_id, title, subject, description, due_date, total_marks, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, student_id, title, subject, description, due_date, total_marks, status, created_at`,
        [studentId ?? null, title, subject, description ?? null, dueDate, totalMarks, status ?? 'Open'],
    );

    return normalizeAssignmentRecord(result.rows[0]);
};

export const listAssignments = async (filters = {}) => {
    const { studentId, status } = filters;
    const values = [];
    const conditions = [];

    if (studentId !== undefined && studentId !== null && studentId !== '') {
        values.push(studentId);
        conditions.push(`student_id = $${values.length}`);
    }

    if (status) {
        values.push(status);
        conditions.push(`status = $${values.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await pool.query(
        `SELECT id, student_id, title, subject, description, due_date, total_marks, status, created_at
     FROM assignments
     ${whereClause}
     ORDER BY created_at DESC`,
        values,
    );

    return result.rows.map(normalizeAssignmentRecord);
};

export const getAssignmentById = async (id) => {
    const result = await pool.query(
        `SELECT id, student_id, title, subject, description, due_date, total_marks, status, created_at
     FROM assignments
     WHERE id = $1`,
        [id],
    );

    return result.rows[0] ? normalizeAssignmentRecord(result.rows[0]) : null;
};

export const updateAssignment = async (id, assignmentData) => {
    const fields = [];
    const values = [];

    Object.entries(assignmentData).forEach(([key, value]) => {
        if (value === undefined) return;
        const column = {
            title: 'title',
            subject: 'subject',
            description: 'description',
            dueDate: 'due_date',
            totalMarks: 'total_marks',
            status: 'status',
        }[key];

        if (column) {
            fields.push(`${column} = $${values.length + 1}`);
            values.push(value);
        }
    });

    if (!fields.length) {
        return getAssignmentById(id);
    }

    values.push(id);
    const result = await pool.query(
        `UPDATE assignments
     SET ${fields.join(', ')}
     WHERE id = $${values.length}
     RETURNING id, student_id, title, subject, description, due_date, total_marks, status, created_at`,
        values,
    );

    return result.rows[0] ? normalizeAssignmentRecord(result.rows[0]) : null;
};

export const deleteAssignment = async (id) => {
    const result = await pool.query(
        'DELETE FROM assignments WHERE id = $1 RETURNING id',
        [id],
    );

    return result.rowCount > 0;
};

export const submitAssignment = async (assignmentId, studentId, submissionData) => {
    const { content, fileUrl } = submissionData;
    const result = await pool.query(
        `INSERT INTO assignment_submissions (assignment_id, student_id, content, file_url, status)
     VALUES ($1, $2, $3, $4, 'Submitted')
     ON CONFLICT (assignment_id, student_id)
     DO UPDATE SET content = EXCLUDED.content, file_url = EXCLUDED.file_url, status = 'Submitted', submitted_at = NOW()
     RETURNING id, assignment_id, student_id, content, file_url, status, submitted_at`,
        [assignmentId, studentId, content ?? null, fileUrl ?? null],
    );

    return normalizeSubmissionRecord(result.rows[0]);
};

export const getSubmissionByAssignment = async (assignmentId, studentId) => {
    const result = await pool.query(
        `SELECT id, assignment_id, student_id, content, file_url, status, submitted_at
     FROM assignment_submissions
     WHERE assignment_id = $1 AND student_id = $2`,
        [assignmentId, studentId],
    );

    return result.rows[0] ? normalizeSubmissionRecord(result.rows[0]) : null;
};

export const addFeedback = async (assignmentId, studentId, feedbackData) => {
    const { remarks, grade } = feedbackData;
    const result = await pool.query(
        `INSERT INTO assignment_feedback (assignment_id, student_id, remarks, grade)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (assignment_id, student_id)
     DO UPDATE SET remarks = EXCLUDED.remarks, grade = EXCLUDED.grade, created_at = NOW()
     RETURNING id, assignment_id, student_id, remarks, grade, created_at`,
        [assignmentId, studentId, remarks, grade],
    );

    return {
        assignmentId: result.rows[0].assignment_id,
        studentId: result.rows[0].student_id,
        remarks: result.rows[0].remarks,
        grade: result.rows[0].grade,
        createdAt: result.rows[0].created_at,
    };
};

export const addGrade = async (assignmentId, studentId, gradeData) => {
    const { score, remarks } = gradeData;
    const result = await pool.query(
        `INSERT INTO assignment_grades (assignment_id, student_id, score, remarks)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (assignment_id, student_id)
     DO UPDATE SET score = EXCLUDED.score, remarks = EXCLUDED.remarks, created_at = NOW()
     RETURNING id, assignment_id, student_id, score, remarks, created_at`,
        [assignmentId, studentId, score, remarks ?? null],
    );

    return {
        assignmentId: result.rows[0].assignment_id,
        studentId: result.rows[0].student_id,
        score: result.rows[0].score,
        remarks: result.rows[0].remarks,
        createdAt: result.rows[0].created_at,
    };
};

export default {
    createAssignment,
    listAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
    submitAssignment,
    getSubmissionByAssignment,
    addFeedback,
    addGrade,
};
