// admin.college.service.js
 
import { pool } from '../config/db.js';
 
const listColleges = async ({ search, status, department, page=1, limit=20 }) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;
    const offset =(page-1)*limit;

    let query=`SELECT * FROM colleges WHERE 1=1`;
    let values=[];

    //status filter
    if(status){
        values.push(status);
        query+=`AND status = $${values.length}`;
    }

    //search filter
    if(search){
        values.push(`%${search}%`);
        query+=`AND (name ILIKE $${values.length} OR email ILIKE $${values.length} OR location ILIKE $${values.length})`;
    }

    // deparment filter
    if(department){
        values.push(department);
        query+=`AND $${values.length} = ANY(departments)`;
    }

    //pagination
    values.push(limit);
    values.push(offset);

    query += ` ORDER BY id DESC LIMIT $${values.length - 1} OFFSET $${values.length}`;

    const result = await pool.query(query,values);

    return result.rows;
};
const getCollegeById  = async (id) => { 
    const result = await pool.query(
        `SELECT
            c.id AS "collegeId",
            c.name,
            c.email,
            c.location,
            c.departments,
            c.student_strength AS "studentStrength",
            c.status,
            c.rejection_reason AS "rejectionReason",
            c.suspension_reason AS "suspensionReason",
            c.verified_at AS "verifiedAt",
            c.created_at AS "createdAt",

            json_build_object(
                'totalStudentsEnrolled', s.total_students_enrolled,
                'totalSelected', s.total_selected,
                'activeDriveCount', s.active_drive_count,
                'participationRate', s.participation_rate,
                'selectionRate', s.selection_rate,
                'performanceRank', s.performance_rank
            ) AS stats

        FROM colleges c
        LEFT JOIN college_stats s
        ON c.id = s.college_id

        WHERE c.id = $1
        `,[id]
    );
    return result.rows[0];
};
const getCollegeStats = async (id) => { 
    const result = await pool.query(
    `SELECT
        college_id AS "collegeId",
        total_students_enrolled AS "totalStudentsEnrolled",
        total_selected AS "totalSelected",
        active_drive_count AS "activeDriveCount",
        participation_rate AS "participationRate",
        selection_rate AS "selectionRate",
        performance_rank AS "performanceRank",
        last_updated AS "lastUpdated"
    FROM college_stats
    WHERE college_id = $1`,
    [id]
  );
  return result.rows[0];
};
const approveCollege = async (id) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const existing = await client.query(
            `SELECT * FROM colleges WHERE id = $1`,
            [id]
        );

        if (existing.rows.length === 0) {
            await client.query('ROLLBACK');
            return null;
        }

        const college = existing.rows[0];

        if (college.status === 'approved') {
            await client.query('ROLLBACK');
            return { alreadyApproved: true };
        }

        if (college.status !== 'pending') {
            await client.query('ROLLBACK');
            throw new Error('Only pending colleges can be approved.');
        }

        const result = await client.query(
            `
            UPDATE colleges
            SET
                status = 'approved',
                verified_at = NOW(),
                rejection_reason = NULL,
                suspension_reason = NULL
            WHERE id = $1
            RETURNING
                id AS "collegeId",
                name,
                email,
                status,
                verified_at AS "verifiedAt"
            `,
            [id]
        );

        await client.query('COMMIT');

        return result.rows[0];

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {

        client.release();
    }
};
const rejectCollege = async (id, reason) => {

    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const existing = await client.query(
            `SELECT * FROM colleges WHERE id = $1`,
            [id]
        );
        if (existing.rows.length === 0) {
            await client.query('ROLLBACK');
            return null;
        }
        const college = existing.rows[0];
        if (college.status !== 'pending') {
            await client.query('ROLLBACK');
            throw new Error('Only pending colleges can be rejected.');
        }
        const result = await client.query(
            `
            UPDATE colleges
            SET
                status = 'rejected',
                rejection_reason = $2,
                suspension_reason = NULL
            WHERE id = $1
            RETURNING
                id AS "collegeId",
                name,
                email,
                status,
                rejection_reason AS "rejectionReason"
            `,
            [id, reason]
        );
        await client.query('COMMIT');
        return result.rows[0];
    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {

        client.release();
    }
};
const suspendCollege = async (id, reason) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const existing = await client.query(
            `SELECT * FROM colleges WHERE id = $1`,
            [id]
        );

        if (existing.rows.length === 0) {
            await client.query('ROLLBACK');
            return null;
        }

        const college = existing.rows[0];

        if (college.status !== 'approved') {
            await client.query('ROLLBACK');
            throw new Error('Only approved colleges can be suspended.');
        }

        const result = await client.query(
            `
            UPDATE colleges
            SET
                status = 'suspended',
                suspension_reason = $2
            WHERE id = $1
            RETURNING
                id AS "collegeId",
                name,
                email,
                status,
                suspension_reason AS "suspensionReason"
            `,
            [id, reason]
        );

        await client.query('COMMIT');

        return result.rows[0];

    } catch (err) {

        await client.query('ROLLBACK');
        throw err;

    } finally {

        client.release();
    }
};
const getCollegeRankings = async () => {

    const result = await pool.query(
        `
        SELECT
            ROW_NUMBER() OVER (ORDER BY s.selection_rate DESC) AS rank,
            c.id AS "collegeId",
            c.name,
            s.selection_rate AS "selectionRate",
            s.participation_rate AS "participationRate",
            s.total_selected AS "totalSelected"

        FROM colleges c

        JOIN college_stats s
        ON c.id = s.college_id

        WHERE c.status = 'approved'

        ORDER BY s.selection_rate DESC
        `
    );

    return result.rows;
};
const getCollegesNeedingDrives = async () => {

    const result = await pool.query(`
        SELECT
            c.id AS "collegeId",
            c.name,
            c.email,
            c.student_strength AS "studentStrength"

        FROM colleges c

        JOIN college_stats s
        ON c.id = s.college_id

        WHERE
            c.status = 'approved'
            AND s.active_drive_count = 0
    `);

    return result.rows;
};
 
export {
  listColleges, getCollegeById, getCollegeStats,
  approveCollege, rejectCollege, suspendCollege,
  getCollegeRankings, getCollegesNeedingDrives
};
