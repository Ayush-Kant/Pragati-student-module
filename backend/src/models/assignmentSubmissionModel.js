import { pool } from '../../config/db.js';
import { SUBMISSION_STATUS } from '../constants/assignmentConstants.js';
import { buildSubmissionPayload } from '../utils/assignmentHelpers.js';

export const submitAssignment = async (assignmentId, studentId, submissionData) => {
    const assignmentResult = await pool.query(
        `SELECT due_date, grace_days, penalty_per_day, allow_resubmission, max_resubmissions, submission_type, status
         FROM assignments WHERE id = $1`,
        [assignmentId],
    );
    const assignment = assignmentResult.rows[0];
    if (!assignment) throw Object.assign(new Error('Assignment not found'), { status: 404 });
    if (assignment.status === 'closed') throw Object.assign(new Error('This assignment is closed'), { status: 403 });

    const existing = await pool.query(
        `SELECT attempt_number FROM assignment_submissions WHERE assignment_id = $1 AND student_id = $2`,
        [assignmentId, studentId],
    );
    const currentAttempt = Number(existing.rows[0]?.attempt_number || 0);
    if (currentAttempt > 0 && !assignment.allow_resubmission) throw Object.assign(new Error('Resubmission is not permitted for this assignment'), { status: 403 });
    if (currentAttempt >= Number(assignment.max_resubmissions || 0) + 1) throw Object.assign(new Error('Maximum resubmission limit reached'), { status: 403 });

    const submissionType = assignment.submission_type || 'both';
    const hasFile = Boolean(submissionData.fileUrl || submissionData.fileName);
    const hasText = Boolean(submissionData.content?.trim());
    if (submissionType === 'file' && !hasFile) throw Object.assign(new Error('A file submission is required'), { status: 400 });
    if (submissionType === 'text' && !hasText) throw Object.assign(new Error('A written response is required'), { status: 400 });

    const now = new Date();
    const due = assignment.due_date ? new Date(`${assignment.due_date}T23:59:59`) : null;
    const dayLate = due && now > due ? Math.ceil((now.getTime() - due.getTime()) / 86400000) : 0;
    const graceDays = Number(assignment.grace_days || 0);
    const billableLateDays = Math.max(0, dayLate - graceDays);
    const penalty = Math.min(100, billableLateDays * Number(assignment.penalty_per_day || 0));
    const status = billableLateDays > 0 ? SUBMISSION_STATUS.LATE : SUBMISSION_STATUS.SUBMITTED;
    const attemptNumber = currentAttempt + 1;

    const result = await pool.query(
        `INSERT INTO assignment_submissions (assignment_id, student_id, content, file_url, status, submitted_file_name, submitted_file_type, late_days, late_penalty, attempt_number)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         ON CONFLICT (assignment_id, student_id)
         DO UPDATE SET content=EXCLUDED.content, file_url=EXCLUDED.file_url, status=EXCLUDED.status,
                       submitted_file_name=EXCLUDED.submitted_file_name, submitted_file_type=EXCLUDED.submitted_file_type,
                       late_days=EXCLUDED.late_days, late_penalty=EXCLUDED.late_penalty, attempt_number=EXCLUDED.attempt_number, submitted_at=NOW()
         RETURNING id, assignment_id, student_id, content, file_url, status, submitted_file_name, submitted_file_type, late_days, late_penalty, attempt_number, submitted_at`,
        [assignmentId, studentId, submissionData.content ?? null, submissionData.fileUrl ?? null, status, submissionData.fileName ?? null, submissionData.fileType ?? null, billableLateDays, penalty, attemptNumber],
    );

    return buildSubmissionPayload({
        id: result.rows[0].id, assignmentId: result.rows[0].assignment_id, studentId: result.rows[0].student_id,
        content: result.rows[0].content, fileUrl: result.rows[0].file_url, fileName: result.rows[0].submitted_file_name,
        fileType: result.rows[0].submitted_file_type, status: result.rows[0].status, lateDays: result.rows[0].late_days,
        latePenalty: result.rows[0].late_penalty, attemptNumber: result.rows[0].attempt_number, submittedAt: result.rows[0].submitted_at,
    });
};

export const getSubmissionByAssignment = async (assignmentId, studentId) => {
    const result = await pool.query(
        `SELECT id, assignment_id, student_id, content, file_url, status, submitted_file_name, submitted_file_type, late_days, late_penalty, attempt_number, submitted_at
         FROM assignment_submissions WHERE assignment_id=$1 AND student_id=$2`,
        [assignmentId, studentId],
    );
    if (!result.rows[0]) return null;
    const r = result.rows[0];
    return buildSubmissionPayload({ id:r.id, assignmentId:r.assignment_id, studentId:r.student_id, content:r.content, fileUrl:r.file_url, fileName:r.submitted_file_name, fileType:r.submitted_file_type, status:r.status, lateDays:r.late_days, latePenalty:r.late_penalty, attemptNumber:r.attempt_number, submittedAt:r.submitted_at });
};

export const listAllSubmissions = async (filters = {}) => {
    const values = []; const conditions = [];
    if (filters.assignmentId !== undefined && filters.assignmentId !== null && filters.assignmentId !== '') { values.push(filters.assignmentId); conditions.push(`assignment_id=$${values.length}`); }
    if (filters.studentId !== undefined && filters.studentId !== null && filters.studentId !== '') { values.push(filters.studentId); conditions.push(`student_id=$${values.length}`); }
    if (filters.status) { values.push(filters.status); conditions.push(`status=$${values.length}`); }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await pool.query(`SELECT id,assignment_id,student_id,content,file_url,status,submitted_file_name,submitted_file_type,late_days,late_penalty,attempt_number,submitted_at FROM assignment_submissions ${where} ORDER BY submitted_at DESC`, values);
    return result.rows.map((r) => buildSubmissionPayload({ id:r.id, assignmentId:r.assignment_id, studentId:r.student_id, content:r.content, fileUrl:r.file_url, fileName:r.submitted_file_name, fileType:r.submitted_file_type, status:r.status, lateDays:r.late_days, latePenalty:r.late_penalty, attemptNumber:r.attempt_number, submittedAt:r.submitted_at }));
};

export default { submitAssignment, getSubmissionByAssignment, listAllSubmissions };
