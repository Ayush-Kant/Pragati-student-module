import { pool } from '../config/db.js';

const getHistory = async ({ page = 1, limit = 20, offset = 0 } = {}) => {
    const values = [limit, offset];
    const result = await pool.query(
        `
        SELECT id, report_id AS "reportId", action, created_at AS "createdAt"
        FROM report_history
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
        `,
        values
    );

    return result.rows;
};

const countHistory = async () => {
    const result = await pool.query(`SELECT COUNT(*)::INTEGER AS total FROM report_history`);
    return result.rows[0]?.total || 0;
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

const getHistoryById = async (id) => {
    const result = await pool.query(
        `
        SELECT id, report_id AS "reportId", action, created_at AS "createdAt"
        FROM report_history
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0] || null;
};

const deleteHistoryById = async (id) => {
    const result = await pool.query(
        `DELETE FROM report_history WHERE id = $1 RETURNING id`,
        [id]
    );

    return result.rows[0] || null;
};

export {
    getHistory,
    countHistory,
    createHistoryEntry,
    getHistoryById,
    deleteHistoryById,
};
