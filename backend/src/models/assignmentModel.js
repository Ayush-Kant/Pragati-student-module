import { pool } from '../../config/db.js';
import { ASSIGNMENT_STATUS } from '../constants/assignmentConstants.js';
import { buildAssignmentPayload } from '../utils/assignmentHelpers.js';

const assignmentSelect = `
  a.id, a.student_id, a.title, a.subject, a.description, a.due_date, a.total_marks, a.status, a.created_at,
  a.submission_type, a.starter_file_url, a.grace_days, a.penalty_per_day, a.allow_resubmission, a.max_resubmissions,
  s.id AS submission_id, s.status AS submission_status, s.content AS submission_content, s.file_url AS submission_file_url,
  s.submitted_at AS submission_submitted_at, s.attempt_number, s.late_days, s.late_penalty,
  g.score AS grade_score, g.remarks AS grade_remarks, g.created_at AS grade_created_at,
  f.remarks AS feedback_remarks, f.grade AS feedback_grade, f.inline_comments AS feedback_inline_comments, f.created_at AS feedback_created_at
`;

const buildAssignment = (row) => buildAssignmentPayload({
    id: row.id, studentId: row.student_id, title: row.title, subject: row.subject, description: row.description,
    dueDate: row.due_date, totalMarks: row.total_marks, status: row.status, createdAt: row.created_at,
    submissionType: row.submission_type, starterFileUrl: row.starter_file_url, graceDays: row.grace_days,
    penaltyPerDay: row.penalty_per_day, allowResubmission: row.allow_resubmission, maxResubmissions: row.max_resubmissions,
    submission: row.submission_id ? {
      id: row.submission_id, assignmentId: row.id, status: row.submission_status, content: row.submission_content,
      fileUrl: row.submission_file_url, submittedAt: row.submission_submitted_at, attemptNumber: row.attempt_number,
      lateDays: row.late_days, latePenalty: row.late_penalty,
    } : null,
    grade: row.grade_score !== null && row.grade_score !== undefined ? {
      score: Number(row.grade_score), remarks: row.grade_remarks, createdAt: row.grade_created_at,
    } : null,
    feedback: row.feedback_remarks || row.feedback_grade || row.feedback_inline_comments ? {
      remarks: row.feedback_remarks, grade: row.feedback_grade, inlineComments: row.feedback_inline_comments, createdAt: row.feedback_created_at,
    } : null,
});

const submissionJoin = (studentPlaceholder) => `
  LEFT JOIN LATERAL (
    SELECT asub.id, asub.status, asub.content, asub.file_url, asub.submitted_at, asub.attempt_number, asub.late_days, asub.late_penalty
    FROM assignment_submissions asub
    WHERE asub.assignment_id = a.id AND asub.student_id = ${studentPlaceholder}
    ORDER BY asub.submitted_at DESC, asub.id DESC LIMIT 1
  ) s ON TRUE
  LEFT JOIN assignment_grades g ON g.assignment_id = a.id AND g.student_id = ${studentPlaceholder}
  LEFT JOIN assignment_feedback f ON f.assignment_id = a.id AND f.student_id = ${studentPlaceholder}
`;

export const createAssignment = async (data) => {
  const { studentId, title, subject, description, dueDate, totalMarks, status, submissionType, starterFileUrl, graceDays, penaltyPerDay, allowResubmission, maxResubmissions } = data;
  const result = await pool.query(`INSERT INTO assignments (student_id,title,subject,description,due_date,total_marks,status,submission_type,starter_file_url,grace_days,penalty_per_day,allow_resubmission,max_resubmissions) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`, [studentId ?? null,title,subject,description ?? null,dueDate,totalMarks,status ?? ASSIGNMENT_STATUS.OPEN,submissionType ?? 'both',starterFileUrl ?? null,graceDays ?? 0,penaltyPerDay ?? 0,allowResubmission ?? true,maxResubmissions ?? 3]);
  return buildAssignment(result.rows[0]);
};

export const listAssignments = async ({ studentId, status } = {}) => {
  if (!studentId) return [];
  const values = [studentId];
  const conditions = ['(a.student_id = $1 OR a.student_id IS NULL)'];
  if (status) { values.push(status); conditions.push(`a.status = $${values.length}`); }
  const result = await pool.query(`SELECT ${assignmentSelect} FROM assignments a ${submissionJoin('$1')} WHERE ${conditions.join(' AND ')} ORDER BY a.due_date ASC, a.created_at DESC`, values);
  return result.rows.map(buildAssignment);
};

export const getAssignmentById = async (id, studentId = null) => {
  const values = [id];
  const studentCondition = studentId !== null && studentId !== undefined ? 'AND (a.student_id = $2 OR a.student_id IS NULL)' : '';
  if (studentCondition) values.push(studentId);
  const join = studentCondition ? submissionJoin('$2') : '';
  const result = await pool.query(`SELECT ${assignmentSelect} FROM assignments a ${join} WHERE a.id = $1 ${studentCondition} LIMIT 1`, values);
  return result.rows[0] ? buildAssignment(result.rows[0]) : null;
};

export const updateAssignment = async (id, data) => {
  const fields = []; const values = [];
  const allowed = { title:'title', subject:'subject', description:'description', dueDate:'due_date', totalMarks:'total_marks', status:'status', submissionType:'submission_type', starterFileUrl:'starter_file_url', graceDays:'grace_days', penaltyPerDay:'penalty_per_day', allowResubmission:'allow_resubmission', maxResubmissions:'max_resubmissions' };
  Object.entries(data).forEach(([key,value]) => { if (value !== undefined && allowed[key]) { values.push(value); fields.push(`${allowed[key]} = $${values.length}`); } });
  if (!fields.length) return getAssignmentById(id);
  values.push(id);
  const result = await pool.query(`UPDATE assignments SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`, values);
  return result.rows[0] ? buildAssignment(result.rows[0]) : null;
};

export const deleteAssignment = async (id) => { const result = await pool.query('DELETE FROM assignments WHERE id = $1 RETURNING id', [id]); return result.rowCount > 0; };

export const getAssignmentStatistics = async ({ studentId } = {}) => {
  const result = await pool.query(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE a.status = $2)::int AS closed, COUNT(*) FILTER (WHERE a.status = $3)::int AS open, COUNT(*) FILTER (WHERE a.status = $4)::int AS pending, COUNT(DISTINCT s.assignment_id)::int AS submitted, COALESCE(AVG(g.score),0)::float AS "averageScore"
    FROM assignments a LEFT JOIN assignment_submissions s ON s.assignment_id=a.id AND s.student_id=$1 LEFT JOIN assignment_grades g ON g.assignment_id=a.id AND g.student_id=$1
    WHERE a.student_id=$1 OR a.student_id IS NULL`, [studentId, ASSIGNMENT_STATUS.CLOSED, ASSIGNMENT_STATUS.OPEN, ASSIGNMENT_STATUS.PENDING]);
  return result.rows[0];
};

export default { createAssignment, listAssignments, getAssignmentById, updateAssignment, deleteAssignment, getAssignmentStatistics };
