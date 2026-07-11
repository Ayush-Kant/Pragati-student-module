// admin.course.service.js

import { pool } from '../config/db.js';

const listCourses = async ({ status, mentorId, mentor_id, driveId, drive_id, page = 1, limit = 20 }) => {
    const filterMentorId = mentorId || mentor_id;
    const filterDriveId = driveId || drive_id;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;
    const offset = (page - 1) * limit;

    let query = `
        SELECT
            c.id AS "courseId",
            c.mentor_id AS "mentorId",
            c.drive_id AS "driveId",
            c.title,
            c.description,
            c.skill_tags AS "skillTags",
            c.status,
            c.created_at AS "createdAt",
            c.updated_at AS "updatedAt",
            u.full_name AS "mentorName"
        FROM courses c
        LEFT JOIN mentors m ON c.mentor_id = m.id
        LEFT JOIN users u ON m.user_id = u.id
        WHERE 1=1
    `;
    let values = [];

    if (status) {
        values.push(status);
        query += ` AND c.status = $${values.length}`;
    }

    if (filterMentorId) {
        values.push(filterMentorId);
        query += ` AND c.mentor_id = $${values.length}`;
    }

    if (filterDriveId) {
        values.push(filterDriveId);
        query += ` AND c.drive_id = $${values.length}`;
    }

    values.push(limit);
    values.push(offset);

    query += ` ORDER BY c.id DESC LIMIT $${values.length - 1} OFFSET $${values.length}`;

    const result = await pool.query(query, values);
    return result.rows;
};

const getCourseById = async (id) => {
    const courseResult = await pool.query(
        `
        SELECT
            c.id AS "courseId",
            c.mentor_id AS "mentorId",
            c.drive_id AS "driveId",
            c.title,
            c.description,
            c.skill_tags AS "skillTags",
            c.status,
            c.created_at AS "createdAt",
            c.updated_at AS "updatedAt",
            u.full_name AS "mentorName",
            u.email AS "mentorEmail"
        FROM courses c
        LEFT JOIN mentors m ON c.mentor_id = m.id
        LEFT JOIN users u ON m.user_id = u.id
        WHERE c.id = $1
        `,
        [id]
    );

    if (courseResult.rows.length === 0) {
        return null;
    }

    const course = courseResult.rows[0];

    const modulesResult = await pool.query(
        `
        SELECT
            id AS "moduleId",
            title,
            order_index AS "orderIndex",
            created_at AS "createdAt"
        FROM modules
        WHERE course_id = $1
        ORDER BY order_index ASC
        `,
        [id]
    );

    const assessmentsResult = await pool.query(
        `
        SELECT
            id AS "assessmentId",
            title,
            created_at AS "createdAt"
        FROM assessments
        WHERE course_id = $1
        ORDER BY id ASC
        `,
        [id]
    );

    course.modules = modulesResult.rows;
    course.assessments = assessmentsResult.rows;

    return course;
};

const updateCourseStatus = async (id, status) => {
    const allowedStatuses = ['draft', 'published', 'archived'];
    if (!allowedStatuses.includes(status)) {
        throw new Error('Invalid status. Allowed statuses are: draft, published, archived.');
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const existing = await client.query(
            `
            SELECT *
            FROM courses
            WHERE id = $1
            `,
            [id]
        );

        if (existing.rows.length === 0) {
            await client.query('ROLLBACK');
            return null;
        }

        const result = await client.query(
            `
            UPDATE courses
            SET
                status = $2,
                updated_at = NOW()
            WHERE id = $1
            RETURNING
                id AS "courseId",
                mentor_id AS "mentorId",
                drive_id AS "driveId",
                title,
                description,
                skill_tags AS "skillTags",
                status,
                created_at AS "createdAt",
                updated_at AS "updatedAt"
            `,
            [id, status]
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

const getTrainingStats = async () => {
    // Robustly check table columns to prevent runtime errors due to schema variations
    const columnRes = await pool.query(
        `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'student_drive_progress'
          AND column_name IN ('stage', 'current_stage')
        LIMIT 1
        `
    );
    const stageColumn = columnRes.rows[0]?.column_name || 'stage';

    const scoreRes = await pool.query(
        `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'student_drive_progress'
          AND column_name = 'assessment_score'
        LIMIT 1
        `
    );
    const hasScoreColumn = scoreRes.rows.length > 0;

    const coursesCount = await pool.query(
        `
        SELECT COUNT(*)::int AS count
        FROM courses
        `
    );

    const publishedCount = await pool.query(
        `
        SELECT COUNT(*)::int AS count
        FROM courses
        WHERE status = 'published'
        `
    );

    let avgScore = 0.00;
    if (hasScoreColumn) {
        const scoreQueryRes = await pool.query(
            `
            SELECT COALESCE(ROUND(AVG(assessment_score), 2), 0.00)::numeric AS avg
            FROM student_drive_progress
            `
        );
        avgScore = parseFloat(scoreQueryRes.rows[0]?.avg || 0.00);
    }

    const studentsQuery = `
        SELECT COUNT(*)::int AS count
        FROM student_drive_progress
        WHERE ${stageColumn} IN ('training', 'trained')
    `;
    const studentsRes = await pool.query(studentsQuery);

    return {
        totalCourses: coursesCount.rows[0]?.count || 0,
        publishedCourses: publishedCount.rows[0]?.count || 0,
        averageAssessmentScore: avgScore,
        totalStudentsInTraining: studentsRes.rows[0]?.count || 0
    };
};

export {
    listCourses,
    getCourseById,
    updateCourseStatus,
    getTrainingStats
};
