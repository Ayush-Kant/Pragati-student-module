import { pool } from '../../config/db.js';
import { SUBMISSION_STATUS } from '../constants/assignmentConstants.js';
import { buildSubmissionPayload } from '../utils/assignmentHelpers.js';

export const submitAssignment = async (assignmentId, studentId, submissionData) => {
    const { content, fileUrl } = submissionData;
    const result = await pool.query(
        `INSERT INTO assignment_submissions (assignment_id, student_id, content, file_url, status)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (assignment_id, student_id)
     DO UPDATE SET content = EXCLUDED.content, file_url = EXCLUDED.file_url, status = EXCLUDED.status, submitted_at = NOW()
     RETURNING id, assignment_id, student_id, content, file_url, status, submitted_at`,
        [assignmentId, studentId, content ?? null, fileUrl ?? null, SUBMISSION_STATUS.SUBMITTED],
    );

    return buildSubmissionPayload({
        id: result.rows[0].id,
        assignmentId: result.rows[0].assignment_id,
        studentId: result.rows[0].student_id,
        content: result.rows[0].content,
        fileUrl: result.rows[0].file_url,
        status: result.rows[0].status,
        submittedAt: result.rows[0].submitted_at,
    });
};

export const getSubmissionByAssignment = async (assignmentId, studentId) => {
    const result = await pool.query(
        `SELECT id, assignment_id, student_id, content, file_url, status, submitted_at
     FROM assignment_submissions
     WHERE assignment_id = $1 AND student_id = $2`,
        [assignmentId, studentId],
    );

    if (!result.rows[0]) {
        return null;
    }

    return buildSubmissionPayload({
        id: result.rows[0].id,
        assignmentId: result.rows[0].assignment_id,
        studentId: result.rows[0].student_id,
        content: result.rows[0].content,
        fileUrl: result.rows[0].file_url,
        status: result.rows[0].status,
        submittedAt: result.rows[0].submitted_at,
    });
};

export const listAllSubmissions = async (filters = {}) => {
    const values = [];
    const conditions = [];

    if (filters.assignmentId !== undefined && filters.assignmentId !== null && filters.assignmentId !== '') {
        values.push(filters.assignmentId);
        conditions.push(`assignment_id = $${values.length}`);
    }

    if (filters.studentId !== undefined && filters.studentId !== null && filters.studentId !== '') {
        values.push(filters.studentId);
        conditions.push(`student_id = $${values.length}`);
    }

    if (filters.status) {
        values.push(filters.status);
        conditions.push(`status = $${values.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await pool.query(
        `SELECT id, assignment_id, student_id, content, file_url, status, submitted_at
     FROM assignment_submissions
     ${whereClause}
     ORDER BY submitted_at DESC`,
        values,
    );

    return result.rows.map((row) => buildSubmissionPayload({
        id: row.id,
        assignmentId: row.assignment_id,
        studentId: row.student_id,
        content: row.content,
        fileUrl: row.file_url,
        status: row.status,
        submittedAt: row.submitted_at,
    }));
};

export default {
    submitAssignment,
    getSubmissionByAssignment,
    listAllSubmissions,
};
