import { pool } from '../../config/db.js';
import { SUBMISSION_STATUS } from '../constants/assignmentConstants.js';
import { buildSubmissionPayload } from '../utils/assignmentHelpers.js';

const assignmentError = (message, status) => Object.assign(new Error(message), { status });

const mapSubmission = (row) => buildSubmissionPayload({
    id: row.id,
    assignmentId: row.assignment_id,
    studentId: row.student_id,
    content: row.content,
    fileUrl: row.file_url,
    fileName: row.submitted_file_name,
    fileType: row.submitted_file_type,
    status: row.status,
    lateDays: row.late_days,
    latePenalty: row.late_penalty,
    attemptNumber: row.attempt_number,
    submittedAt: row.submitted_at,
});

export const submitAssignment = async (assignmentId, studentId, submissionData = {}) => {
    const assignmentResult = await pool.query(
        `SELECT due_date, grace_days, penalty_per_day, allow_resubmission, max_resubmissions, submission_type, status
         FROM assignments
         WHERE id = $1`,
        [assignmentId],
    );
    const assignment = assignmentResult.rows[0];
    if (!assignment) throw assignmentError('Assignment not found', 404);
    if (assignment.status === 'Closed') throw assignmentError('This assignment is closed', 403);

    const existingResult = await pool.query(
        `SELECT attempt_number
         FROM assignment_submissions
         WHERE assignment_id = $1 AND student_id = $2
         ORDER BY attempt_number DESC, submitted_at DESC, id DESC
         LIMIT 1`,
        [assignmentId, studentId],
    );
    const currentAttempt = Number(existingResult.rows[0]?.attempt_number || 0);
    const maxResubmissions = Math.max(0, Number(assignment.max_resubmissions || 0));
    if (currentAttempt > 0 && !assignment.allow_resubmission) {
        throw assignmentError('Resubmission is not permitted for this assignment', 403);
    }
    if (currentAttempt >= maxResubmissions + 1) {
        throw assignmentError('Maximum resubmission limit reached', 403);
    }

    const submissionType = String(assignment.submission_type || 'both').toLowerCase();
    const hasUploadedFile = Boolean(submissionData.fileName);
    const hasExternalLink = Boolean(submissionData.fileUrl && !submissionData.fileName);
    const hasText = Boolean(String(submissionData.content || '').trim());

    if (submissionType === 'file' && !hasUploadedFile) {
        throw assignmentError('A PDF or ZIP file upload is required', 400);
    }
    if (submissionType === 'file' && hasExternalLink) {
        throw assignmentError('External links are not accepted for this file-only assignment', 400);
    }
    if (submissionType === 'text' && hasUploadedFile) {
        throw assignmentError('File uploads are not accepted for this text-only assignment', 400);
    }
    if (submissionType === 'text' && !hasText && !hasExternalLink) {
        throw assignmentError('A written response or supported external link is required', 400);
    }
    if (submissionType === 'both' && !hasUploadedFile && !hasText && !hasExternalLink) {
        throw assignmentError('A submission is required', 400);
    }

    const now = new Date();
    const due = assignment.due_date ? new Date(`${assignment.due_date}T23:59:59`) : null;
    const dayLate = due && now > due
        ? Math.ceil((now.getTime() - due.getTime()) / 86400000)
        : 0;
    const graceDays = Math.max(0, Number(assignment.grace_days || 0));
    const billableLateDays = Math.max(0, dayLate - graceDays);
    const penalty = Math.min(100, billableLateDays * Number(assignment.penalty_per_day || 0));
    const status = billableLateDays > 0 ? SUBMISSION_STATUS.LATE : SUBMISSION_STATUS.SUBMITTED;
    const attemptNumber = currentAttempt + 1;

    const result = await pool.query(
        `INSERT INTO assignment_submissions
          (assignment_id, student_id, content, file_url, status, submitted_file_name, submitted_file_type, late_days, late_penalty, attempt_number)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id, assignment_id, student_id, content, file_url, status, submitted_file_name,
                   submitted_file_type, late_days, late_penalty, attempt_number, submitted_at`,
        [
            assignmentId,
            studentId,
            submissionData.content ?? null,
            submissionData.fileUrl ?? null,
            status,
            submissionData.fileName ?? null,
            submissionData.fileType ?? null,
            billableLateDays,
            penalty,
            attemptNumber,
        ],
    );

    return mapSubmission(result.rows[0]);
};

export const getSubmissionByAssignment = async (assignmentId, studentId) => {
    const result = await pool.query(
        `SELECT id, assignment_id, student_id, content, file_url, status, submitted_file_name,
                submitted_file_type, late_days, late_penalty, attempt_number, submitted_at
         FROM assignment_submissions
         WHERE assignment_id = $1 AND student_id = $2
         ORDER BY attempt_number DESC, submitted_at DESC, id DESC
         LIMIT 1`,
        [assignmentId, studentId],
    );
    return result.rows[0] ? mapSubmission(result.rows[0]) : null;
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
    const result = await pool.query(
        `SELECT id, assignment_id, student_id, content, file_url, status, submitted_file_name,
                submitted_file_type, late_days, late_penalty, attempt_number, submitted_at
         FROM assignment_submissions
         ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}
         ORDER BY assignment_id ASC, attempt_number DESC, submitted_at DESC, id DESC`,
        values,
    );
    return result.rows.map(mapSubmission);
};

export default { submitAssignment, getSubmissionByAssignment, listAllSubmissions };
