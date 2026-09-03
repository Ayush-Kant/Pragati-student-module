import { pool } from '../../config/db.js';
import { ASSIGNMENT_STATUS } from '../constants/assignmentConstants.js';
import { buildAssignmentPayload } from '../utils/assignmentHelpers.js';

const assignmentSelect = `
  a.id,
  a.student_id,
  a.title,
  a.subject,
  a.description,
  a.due_date,
  a.total_marks,
  a.status,
  a.created_at,
  s.id AS submission_id,
  s.status AS submission_status,
  s.content AS submission_content,
  s.file_url AS submission_file_url,
  s.submitted_at AS submission_submitted_at
`;

const buildAssignment = (row) => buildAssignmentPayload({
    id: row.id,
    studentId: row.student_id,
    title: row.title,
    subject: row.subject,
    description: row.description,
    dueDate: row.due_date,
    totalMarks: row.total_marks,
    status: row.status,
    createdAt: row.created_at,
    submission: row.submission_id
        ? {
            id: row.submission_id,
            assignmentId: row.id,
            status: row.submission_status,
            content: row.submission_content,
            fileUrl: row.submission_file_url,
            submittedAt: row.submission_submitted_at,
        }
        : null,
});

export const createAssignment = async (assignmentData) => {
    const { studentId, title, subject, description, dueDate, totalMarks, status } = assignmentData;
    const result = await pool.query(
        `INSERT INTO assignments (student_id, title, subject, description, due_date, total_marks, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, student_id, title, subject, description, due_date, total_marks, status, created_at`,
        [studentId ?? null, title, subject, description ?? null, dueDate, totalMarks, status ?? ASSIGNMENT_STATUS.OPEN],
    );
    return buildAssignment(result.rows[0]);
};

export const listAssignments = async (filters = {}) => {
    const { studentId, status } = filters;
    const values = [];
    const conditions = [];

    if (studentId !== undefined && studentId !== null && studentId !== '') {
        values.push(studentId);
        conditions.push(`(a.student_id = $${values.length} OR a.student_id IS NULL)`);
    }

    if (status) {
        values.push(status);
        conditions.push(`a.status = $${values.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const joinStudent = studentId !== undefined && studentId !== null && studentId !== ''
        ? `LEFT JOIN LATERAL (
             SELECT asub.id, asub.status, asub.content, asub.file_url, asub.submitted_at
             FROM assignment_submissions asub
             WHERE asub.assignment_id = a.id AND asub.student_id = $1
             ORDER BY asub.submitted_at DESC, asub.id DESC
             LIMIT 1
           ) s ON TRUE`
        : 'LEFT JOIN LATERAL (SELECT NULL::integer AS id, NULL::text AS status, NULL::text AS content, NULL::text AS file_url, NULL::timestamptz AS submitted_at) s ON TRUE';

    const result = await pool.query(
        `SELECT ${assignmentSelect}
         FROM assignments a
         ${joinStudent}
         ${whereClause}
         ORDER BY a.created_at DESC`,
        values,
    );

    return result.rows.map(buildAssignment);
};

export const getAssignmentById = async (id, studentId = null) => {
    const values = [id];
    const studentCondition = studentId !== null && studentId !== undefined && studentId !== ''
        ? 'AND (a.student_id = $2 OR a.student_id IS NULL)'
        : '';
    if (studentCondition) values.push(studentId);

    const joinStudent = studentCondition
        ? `LEFT JOIN LATERAL (
             SELECT asub.id, asub.status, asub.content, asub.file_url, asub.submitted_at
             FROM assignment_submissions asub
             WHERE asub.assignment_id = a.id AND asub.student_id = $2
             ORDER BY asub.submitted_at DESC, asub.id DESC
             LIMIT 1
           ) s ON TRUE`
        : 'LEFT JOIN LATERAL (SELECT NULL::integer AS id, NULL::text AS status, NULL::text AS content, NULL::text AS file_url, NULL::timestamptz AS submitted_at) s ON TRUE';

    const result = await pool.query(
        `SELECT ${assignmentSelect}
         FROM assignments a
         ${joinStudent}
         WHERE a.id = $1 ${studentCondition}
         LIMIT 1`,
        values,
    );

    return result.rows[0] ? buildAssignment(result.rows[0]) : null;
};

export const updateAssignment = async (id, assignmentData) => {
    const fields = [];
    const values = [];

    Object.entries(assignmentData).forEach(([key, value]) => {
        if (value === undefined) return;
        const column = {
            title: 'title', subject: 'subject', description: 'description',
            dueDate: 'due_date', totalMarks: 'total_marks', status: 'status',
        }[key];
        if (column) {
            fields.push(`${column} = $${values.length + 1}`);
            values.push(value);
        }
    });

    if (!fields.length) return getAssignmentById(id);

    values.push(id);
    const result = await pool.query(
        `UPDATE assignments SET ${fields.join(', ')} WHERE id = $${values.length}
         RETURNING id, student_id, title, subject, description, due_date, total_marks, status, created_at`,
        values,
    );

    return result.rows[0] ? buildAssignment(result.rows[0]) : null;
};

export const deleteAssignment = async (id) => {
    const result = await pool.query('DELETE FROM assignments WHERE id = $1 RETURNING id', [id]);
    return result.rowCount > 0;
};

export const getAssignmentStatistics = async (filters = {}) => {
    const { studentId } = filters;
    if (studentId) {
        const result = await pool.query(
            `SELECT
               COUNT(*)::int AS total,
               COUNT(*) FILTER (WHERE a.status = '${ASSIGNMENT_STATUS.CLOSED}')::int AS closed,
               COUNT(*) FILTER (WHERE a.status = '${ASSIGNMENT_STATUS.OPEN}')::int AS open,
               COUNT(*) FILTER (WHERE a.status = '${ASSIGNMENT_STATUS.PENDING}')::int AS pending,
               COUNT(DISTINCT s.assignment_id)::int AS submitted,
               COALESCE(AVG(g.score), 0.0)::float AS "averageScore"
             FROM assignments a
             LEFT JOIN assignment_submissions s ON s.assignment_id = a.id AND s.student_id = $1
             LEFT JOIN assignment_grades g ON g.assignment_id = a.id AND g.student_id = $1
             WHERE a.student_id = $1 OR a.student_id IS NULL`,
            [studentId],
        );
        return result.rows[0];
    }

    const result = await pool.query(
        `SELECT
           COUNT(*)::int AS total,
           COUNT(*) FILTER (WHERE a.status = '${ASSIGNMENT_STATUS.CLOSED}')::int AS closed,
           COUNT(*) FILTER (WHERE a.status = '${ASSIGNMENT_STATUS.OPEN}')::int AS open,
           COUNT(*) FILTER (WHERE a.status = '${ASSIGNMENT_STATUS.PENDING}')::int AS pending,
           COUNT(DISTINCT s.assignment_id)::int AS submitted,
           COALESCE(AVG(g.score), 0.0)::float AS "averageScore"
         FROM assignments a
         LEFT JOIN assignment_submissions s ON s.assignment_id = a.id
         LEFT JOIN assignment_grades g ON g.assignment_id = a.id`,
    );
    return result.rows[0];
};

export default { createAssignment, listAssignments, getAssignmentById, updateAssignment, deleteAssignment, getAssignmentStatistics };
