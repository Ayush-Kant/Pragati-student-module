import { pool } from '../../config/db.js';
import { buildSubmissionPayload } from '../utils/assignmentHelpers.js';
import { SUBMISSION_STATUS_SUBMITTED } from '../constants/assignmentConstants.js';

export const submitAssignment = async (assignmentId, studentId, submissionData) => {
    const { content, fileUrl } = submissionData;
    const result = await pool.query(
        `INSERT INTO assignment_submissions (assignment_id, student_id, content, file_url, status)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (assignment_id, student_id)
     DO UPDATE SET content = EXCLUDED.content, file_url = EXCLUDED.file_url, status = $5, submitted_at = NOW()
     RETURNING id, assignment_id, student_id, content, file_url, status, submitted_at`,
        [assignmentId, studentId, content ?? null, fileUrl ?? null, SUBMISSION_STATUS_SUBMITTED],
    );

    return buildSubmissionPayload(result.rows[0]);
};

export const getSubmissionByAssignment = async (assignmentId, studentId) => {
    const result = await pool.query(
        `SELECT id, assignment_id, student_id, content, file_url, status, submitted_at
     FROM assignment_submissions
     WHERE assignment_id = $1 AND student_id = $2`,
        [assignmentId, studentId],
    );

    return result.rows[0] ? buildSubmissionPayload(result.rows[0]) : null;
};

export const listAllSubmissions = async (filters = {}) => {
    const { assignmentId, studentId, status } = filters;
    const values = [];
    const conditions = [];

    if (assignmentId) {
        values.push(assignmentId);
        conditions.push(`assignment_id = $${values.length}`);
    }
    if (studentId) {
        values.push(studentId);
        conditions.push(`student_id = $${values.length}`);
    }
    if (status) {
        values.push(status);
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

    return result.rows.map(buildSubmissionPayload);
};

export default {
    submitAssignment,
    getSubmissionByAssignment,
    listAllSubmissions,
};
