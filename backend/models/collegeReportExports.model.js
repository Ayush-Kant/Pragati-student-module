import { pool } from '../config/db.js';

const getExports = async ({ page = 1, limit = 20, offset = 0, status } = {}) => {
    const values = [];
    let query = `
        SELECT id, report_id AS "reportId", format, status, error_message AS "errorMessage", created_at AS "createdAt"
        FROM report_exports
        WHERE 1=1
    `;

    if (status) {
        values.push(status);
        query += ` AND status = $${values.length}`;
    }

    values.push(limit, offset);
    query += ` ORDER BY created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`;

    const result = await pool.query(query, values);
    return result.rows;
};

const countExports = async ({ status } = {}) => {
    const values = [];
    let query = `SELECT COUNT(*)::INTEGER AS total FROM report_exports WHERE 1=1`;

    if (status) {
        values.push(status);
        query += ` AND status = $${values.length}`;
    }

    const result = await pool.query(query, values);
    return result.rows[0]?.total || 0;
};

const createExport = async (payload = {}) => {
    const result = await pool.query(
        `
        INSERT INTO report_exports (report_id, format, status, error_message, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING id, report_id AS "reportId", format, status, error_message AS "errorMessage", created_at AS "createdAt"
        `,
        [
            payload.reportId || payload.report_id || null,
            payload.format || 'pdf',
            payload.status || 'completed',
            payload.errorMessage || payload.error_message || null,
        ]
    );

    return result.rows[0];
};

const getExportById = async (id) => {
    const result = await pool.query(
        `
        SELECT id, report_id AS "reportId", format, status, error_message AS "errorMessage", created_at AS "createdAt"
        FROM report_exports
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0] || null;
};

export {
    getExports,
    countExports,
    createExport,
    getExportById,
};
