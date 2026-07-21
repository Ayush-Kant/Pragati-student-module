import { pool } from '../config/db.js';

const getReports = async ({ page = 1, limit = 20, offset = 0, type, status } = {}) => {
    const values = [];
    let query = `
        SELECT id, title, type, status, format, content, created_at AS "createdAt", updated_at AS "updatedAt"
        FROM generated_reports
        WHERE 1=1
    `;

    if (type) {
        values.push(type);
        query += ` AND type = $${values.length}`;
    }

    if (status) {
        values.push(status);
        query += ` AND status = $${values.length}`;
    }

    values.push(limit, offset);
    query += ` ORDER BY created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`;

    const result = await pool.query(query, values);
    return result.rows;
};

const countReports = async ({ type, status } = {}) => {
    const values = [];
    let query = `SELECT COUNT(*)::INTEGER AS total FROM generated_reports WHERE 1=1`;

    if (type) {
        values.push(type);
        query += ` AND type = $${values.length}`;
    }

    if (status) {
        values.push(status);
        query += ` AND status = $${values.length}`;
    }

    const result = await pool.query(query, values);
    return result.rows[0]?.total || 0;
};

const createReport = async (payload = {}) => {
    const result = await pool.query(
        `
        INSERT INTO generated_reports (
            title,
            type,
            status,
            format,
            content,
            created_by,
            created_at,
            updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING id, title, type, status, format, content, created_at AS "createdAt", updated_at AS "updatedAt"
        `,
        [
            payload.title || 'Generated Report',
            payload.type || 'dashboard',
            payload.status || 'completed',
            payload.format || 'json',
            payload.content ? JSON.stringify(payload.content) : '{}',
            payload.createdBy || null,
        ]
    );

    return result.rows[0];
};

const createHistoryEntry = async ({ reportId, action = 'generated' } = {}) => {
    const result = await pool.query(
        `
        INSERT INTO report_history (report_id, action, created_at)
        VALUES ($1, $2, NOW())
        RETURNING id, report_id AS "reportId", action, created_at AS "createdAt"
        `,
        [reportId, action]
    );

    return result.rows[0];
};

const getReportById = async (id) => {
    const result = await pool.query(
        `
        SELECT id, title, type, status, format, content, created_at AS "createdAt", updated_at AS "updatedAt"
        FROM generated_reports
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0] || null;
};

const deleteReport = async (id) => {
    const result = await pool.query(
        `DELETE FROM generated_reports WHERE id = $1 RETURNING id`,
        [id]
    );

    return result.rows[0] || null;
};

export {
    getReports,
    countReports,
    createReport,
    createHistoryEntry,
    getReportById,
    deleteReport,
};
