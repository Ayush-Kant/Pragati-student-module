import { pool } from '../../config/db.js';
import { ASSIGNMENT_STATUS } from '../constants/assignmentConstants.js';
import { buildAssignmentPayload } from '../utils/assignmentHelpers.js';

export const createAssignment = async (assignmentData) => {
    const { studentId, title, subject, description, dueDate, totalMarks, status } = assignmentData;
    const result = await pool.query(
        `INSERT INTO assignments (student_id, title, subject, description, due_date, total_marks, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, student_id, title, subject, description, due_date, total_marks, status, created_at`,
        [studentId ?? null, title, subject, description ?? null, dueDate, totalMarks, status ?? ASSIGNMENT_STATUS.OPEN],
    );

    return buildAssignmentPayload({
        id: result.rows[0].id,
        studentId: result.rows[0].student_id,
        title: result.rows[0].title,
        subject: result.rows[0].subject,
        description: result.rows[0].description,
        dueDate: result.rows[0].due_date,
        totalMarks: result.rows[0].total_marks,
        status: result.rows[0].status,
        createdAt: result.rows[0].created_at,
    });
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

    return result.rows.map((row) => buildAssignmentPayload({
        id: row.id,
        studentId: row.student_id,
        title: row.title,
        subject: row.subject,
        description: row.description,
        dueDate: row.due_date,
        totalMarks: row.total_marks,
        status: row.status,
        createdAt: row.created_at,
    }));
};

export const getAssignmentById = async (id) => {
    const result = await pool.query(
        `SELECT id, student_id, title, subject, description, due_date, total_marks, status, created_at
     FROM assignments
     WHERE id = $1`,
        [id],
    );

    return result.rows[0] ? buildAssignmentPayload({
        id: result.rows[0].id,
        studentId: result.rows[0].student_id,
        title: result.rows[0].title,
        subject: result.rows[0].subject,
        description: result.rows[0].description,
        dueDate: result.rows[0].due_date,
        totalMarks: result.rows[0].total_marks,
        status: result.rows[0].status,
        createdAt: result.rows[0].created_at,
    }) : null;
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

    return result.rows[0] ? buildAssignmentPayload({
        id: result.rows[0].id,
        studentId: result.rows[0].student_id,
        title: result.rows[0].title,
        subject: result.rows[0].subject,
        description: result.rows[0].description,
        dueDate: result.rows[0].due_date,
        totalMarks: result.rows[0].total_marks,
        status: result.rows[0].status,
        createdAt: result.rows[0].created_at,
    }) : null;
};

export const deleteAssignment = async (id) => {
    const result = await pool.query(
        'DELETE FROM assignments WHERE id = $1 RETURNING id',
        [id],
    );

    return result.rowCount > 0;
};

export const getAssignmentStatistics = async (filters = {}) => {
    const { studentId } = filters;
    let query, params;
    if (studentId) {
        query = `
            SELECT 
                COUNT(*)::int AS total,
                COUNT(CASE WHEN status = '${ASSIGNMENT_STATUS.CLOSED}' THEN 1 END)::int AS closed,
                COUNT(CASE WHEN status = '${ASSIGNMENT_STATUS.OPEN}' THEN 1 END)::int AS open,
                COUNT(CASE WHEN status = '${ASSIGNMENT_STATUS.PENDING}' THEN 1 END)::int AS pending,
                (SELECT COUNT(*)::int FROM assignment_submissions WHERE student_id = $1) AS submitted,
                COALESCE(AVG(g.score), 0.0)::float AS "averageScore"
            FROM assignments a
            LEFT JOIN assignment_grades g ON g.assignment_id = a.id AND g.student_id = $1
            WHERE a.student_id = $1 OR a.student_id IS NULL
        `;
        params = [studentId];
    } else {
        query = `
            SELECT 
                COUNT(*)::int AS total,
                COUNT(CASE WHEN status = '${ASSIGNMENT_STATUS.CLOSED}' THEN 1 END)::int AS closed,
                COUNT(CASE WHEN status = '${ASSIGNMENT_STATUS.OPEN}' THEN 1 END)::int AS open,
                COUNT(CASE WHEN status = '${ASSIGNMENT_STATUS.PENDING}' THEN 1 END)::int AS pending,
                (SELECT COUNT(*)::int FROM assignment_submissions) AS submitted,
                COALESCE(AVG(score), 0.0)::float AS "averageScore"
            FROM assignments a
            LEFT JOIN assignment_grades g ON g.assignment_id = a.id
        `;
        params = [];
    }
    const result = await pool.query(query, params);
    return result.rows[0];
};

export default {
    createAssignment,
    listAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
    getAssignmentStatistics,
};
