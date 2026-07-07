// admin.student.service.js
import { pool } from '../config/db.js';


const listStudents         = async ({ search, college, skills, status, gpaMin, gpaMax, page=1, limit=10 }) => {
    const values = [];
    const conditions = [];

    if (search) {
        values.push(`%${search}%`);
        conditions.push(`s.full_name ILIKE $${values.length}`);
    }

    if (college) {
        values.push(college);
        conditions.push(`s.college = $${values.length}`);
    }

    if (status) {
        values.push(status);
        conditions.push(`s.status = $${values.length}`);
    }

    if (gpaMin) {
        values.push(gpaMin);
        conditions.push(`s.cgpa >= $${values.length}`);
    }

    if (gpaMax) {
        values.push(gpaMax);
        conditions.push(`s.cgpa <= $${values.length}`);
    }

    if (skills) {
        values.push(skills);
        conditions.push(`$${values.length} = ANY(s.skills)`);
    }

    const whereClause =
        conditions.length > 0
            ? `WHERE ${conditions.join(' AND ')}`
            : '';

    const offset = (page - 1) * limit;

    values.push(limit);
    values.push(offset);

    const query = `
        SELECT
            s.*,
            s.college AS college_name
        FROM students s
        ${whereClause}
        ORDER BY s.created_at DESC
        LIMIT $${values.length - 1}
        OFFSET $${values.length}
    `;

    const { rows } = await pool.query(query, values);

    return rows;
 };
const getStudentById       = async (id) => {
    const { rows } = await pool.query(
        `
        SELECT
            s.*,
            s.college AS college_name
        FROM students s
        WHERE s.id = $1
        `,
        [id]
    );

    if (!rows.length) {
        throw new Error('Student not found');
    }

    return rows[0];
};

const getStudentProgress   = async (id) => { 
    const { rows } = await pool.query(
        `
        SELECT
            sdp.*,
            rd.title
        FROM student_drive_progress sdp
        JOIN recruitment_drives rd
            ON rd.id = sdp.drive_id
        WHERE sdp.student_id = $1
        ORDER BY sdp.updated_at DESC
        `,
        [id]
    );

    return rows;
 };


const verifyStudent        = async (id) => { 
    const { rows } = await pool.query(
        `
        UPDATE students
        SET
            profile_verified = TRUE,
            status = 'verified',
            verified_at = NOW()
        WHERE id = $1
        RETURNING *
        `,
        [id]
    );

    if (!rows.length) {
        throw new Error('Student not found');
    }

    return rows[0];
 };

const blockStudent         = async (id, reason) => { 
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const { rows } = await client.query(
            `
            UPDATE students
            SET
                status = 'blocked',
                block_reason = $2
            WHERE id = $1
            RETURNING *
            `,
            [id, reason]
        );

        await client.query('COMMIT');

        return rows[0];
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
 };
const unblockStudent       = async (id) => { 
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const { rows } = await client.query(
            `
            UPDATE students
            SET
                status = 'verified',
                block_reason = NULL
            WHERE id = $1
            RETURNING *
            `,
            [id]
        );

        await client.query('COMMIT');

        return rows[0];
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};
const resetStudentPassword = async (id) => { 
    const { rows } = await pool.query(
        `
        SELECT id, full_name, email
        FROM students
        WHERE id = $1
        `,
        [id]
    );

    if (!rows.length) {
        throw new Error('Student not found');
    }

    return {
        message: 'Password reset process triggered',
        student: rows[0]
    };
 };
const exportStudents       = async ({ college, skills, status, gpaMin, gpaMax }) => {
    const values = [];
    const conditions = [];

    if (college) {
        values.push(college);
        conditions.push(`s.college = $${values.length}`);
    }

    if (skills) {
        values.push(skills);
        conditions.push(`$${values.length} = ANY(s.skills)`);
    }

    if (status) {
        values.push(status);
        conditions.push(`s.status = $${values.length}`);
    }

    if (gpaMin) {
        values.push(gpaMin);
        conditions.push(`s.cgpa >= $${values.length}`);
    }

    if (gpaMax) {
        values.push(gpaMax);
        conditions.push(`s.cgpa <= $${values.length}`);
    }

    const whereClause =
        conditions.length > 0
            ? `WHERE ${conditions.join(' AND ')}`
            : '';

    const { rows } = await pool.query(
        `
        SELECT
            s.id,
            s.full_name,
            s.email,
            s.college,
            s.skills,
            s.cgpa,
            s.status
        FROM students s
        ${whereClause}
        ORDER BY s.created_at DESC
        `,
        values
    );

    let csv =
        'id,name,email,college,skills,cgpa,status\n';

    rows.forEach((student) => {
        csv += `${student.id},"${student.full_name}","${student.email}","${student.college}","${student.skills?.join(',') || ''}",${student.cgpa},${student.status}\n`;
    });

    return csv;
 };

export {
    listStudents,
    getStudentById,
    getStudentProgress,
    verifyStudent,
    blockStudent,
    unblockStudent,
    resetStudentPassword,
    exportStudents
};