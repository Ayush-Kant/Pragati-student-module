import { pool } from '../../config/db.js';
import { SUBMISSION_STATUS } from '../constants/assignmentConstants.js';
import { buildSubmissionPayload } from '../utils/assignmentHelpers.js';

export const submitAssignment = async (assignmentId, studentId, submissionData) => {
    const assignmentResult = await pool.query(
        `SELECT due_date, grace_days, penalty_per_day, allow_resubmission, max_resubmissions, submission_type, status
         FROM assignments WHERE id = $1`, [assignmentId],
    );
    const assignment = assignmentResult.rows[0];
    if (!assignment) throw Object.assign(new Error('Assignment not found'), { status: 404 });
    if (assignment.status === 'Closed') throw Object.assign(new Error('This assignment is closed'), { status: 403 });

    const existing = await pool.query(`SELECT attempt_number FROM assignment_submissions WHERE assignment_id=$1 AND student_id=$2`, [assignmentId, studentId]);
    const currentAttempt = Number(existing.rows[0]?.attempt_number || 0);
    if (currentAttempt > 0 && !assignment.allow_resubmission) throw Object.assign(new Error('Resubmission is not permitted for this assignment'), { status: 403 });
    if (currentAttempt >= Number(assignment.max_resubmissions || 0) + 1) throw Object.assign(new Error('Maximum resubmission limit reached'), { status: 403 });

    const submissionType = assignment.submission_type || 'both';
    const hasUploadedFile = Boolean(submissionData.fileName);
    const hasExternalLink = Boolean(submissionData.fileUrl && !submissionData.fileName);
    const hasText = Boolean(submissionData.content?.trim());
    if (submissionType === 'file' && !hasUploadedFile) throw Object.assign(new Error('A PDF or ZIP file upload is required'), { status: 400 });
    if (submissionType === 'text' && !hasText && !hasExternalLink) throw Object.assign(new Error('A written response or supported external link is required'), { status: 400 });
    if (submissionType === 'file' && hasExternalLink) throw Object.assign(new Error('External links are not accepted for this file-only assignment'), { status: 400 });
    if (submissionType === 'text' && hasUploadedFile) throw Object.assign(new Error('File uploads are not accepted for this text-only assignment'), { status: 400 });
    if (!hasUploadedFile && !hasText && !hasExternalLink) throw Object.assign(new Error('A submission is required'), { status: 400 });

    const now = new Date();
    const due = assignment.due_date ? new Date(`${assignment.due_date}T23:59:59`) : null;
    const dayLate = due && now > due ? Math.ceil((now.getTime() - due.getTime()) / 86400000) : 0;
    const graceDays = Number(assignment.grace_days || 0);
    const billableLateDays = Math.max(0, dayLate - graceDays);
    const penalty = Math.min(100, billableLateDays * Number(assignment.penalty_per_day || 0));
    const status = billableLateDays > 0 ? SUBMISSION_STATUS.LATE : SUBMISSION_STATUS.SUBMITTED;
    const attemptNumber = currentAttempt + 1;

    const result = await pool.query(
        `INSERT INTO assignment_submissions (assignment_id,student_id,content,file_url,status,submitted_file_name,submitted_file_type,late_days,late_penalty,attempt_number)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         ON CONFLICT (assignment_id,student_id) DO UPDATE SET content=EXCLUDED.content,file_url=EXCLUDED.file_url,status=EXCLUDED.status,
           submitted_file_name=EXCLUDED.submitted_file_name,submitted_file_type=EXCLUDED.submitted_file_type,late_days=EXCLUDED.late_days,late_penalty=EXCLUDED.late_penalty,attempt_number=EXCLUDED.attempt_number,submitted_at=NOW()
         RETURNING id,assignment_id,student_id,content,file_url,status,submitted_file_name,submitted_file_type,late_days,late_penalty,attempt_number,submitted_at`,
        [assignmentId, studentId, submissionData.content ?? null, submissionData.fileUrl ?? null, status, submissionData.fileName ?? null, submissionData.fileType ?? null, billableLateDays, penalty, attemptNumber],
    );
    const row = result.rows[0];
    return buildSubmissionPayload({ id:row.id, assignmentId:row.assignment_id, studentId:row.student_id, content:row.content, fileUrl:row.file_url, fileName:row.submitted_file_name, fileType:row.submitted_file_type, status:row.status, lateDays:row.late_days, latePenalty:row.late_penalty, attemptNumber:row.attempt_number, submittedAt:row.submitted_at });
};

export const getSubmissionByAssignment = async (assignmentId, studentId) => {
    const result = await pool.query(`SELECT id,assignment_id,student_id,content,file_url,status,submitted_file_name,submitted_file_type,late_days,late_penalty,attempt_number,submitted_at FROM assignment_submissions WHERE assignment_id=$1 AND student_id=$2`, [assignmentId, studentId]);
    if (!result.rows[0]) return null;
    const row=result.rows[0];
    return buildSubmissionPayload({ id:row.id, assignmentId:row.assignment_id, studentId:row.student_id, content:row.content, fileUrl:row.file_url, fileName:row.submitted_file_name, fileType:row.submitted_file_type, status:row.status, lateDays:row.late_days, latePenalty:row.late_penalty, attemptNumber:row.attempt_number, submittedAt:row.submitted_at });
};

export const listAllSubmissions = async (filters = {}) => {
    const values=[]; const conditions=[];
    if(filters.assignmentId!==undefined&&filters.assignmentId!==null&&filters.assignmentId!==''){values.push(filters.assignmentId);conditions.push(`assignment_id=$${values.length}`);}
    if(filters.studentId!==undefined&&filters.studentId!==null&&filters.studentId!==''){values.push(filters.studentId);conditions.push(`student_id=$${values.length}`);}
    if(filters.status){values.push(filters.status);conditions.push(`status=$${values.length}`);}
    const result=await pool.query(`SELECT id,assignment_id,student_id,content,file_url,status,submitted_file_name,submitted_file_type,late_days,late_penalty,attempt_number,submitted_at FROM assignment_submissions ${conditions.length?`WHERE ${conditions.join(' AND ')}`:''} ORDER BY submitted_at DESC`,values);
    return result.rows.map(row=>buildSubmissionPayload({id:row.id,assignmentId:row.assignment_id,studentId:row.student_id,content:row.content,fileUrl:row.file_url,fileName:row.submitted_file_name,fileType:row.submitted_file_type,status:row.status,lateDays:row.late_days,latePenalty:row.late_penalty,attemptNumber:row.attempt_number,submittedAt:row.submitted_at}));
};

export default { submitAssignment, getSubmissionByAssignment, listAllSubmissions };
