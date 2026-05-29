// company.service.js

import { pool } from '../config/db.js';

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

/**
 * Insert a record into admin_audit_log.
 * Uses the existing table schema:
 *   admin_id    → adminId (req.user.id)
 *   action      → action string
 *   target_type → 'company'
 *   target_id   → company id
 *   metadata    → { reason } (JSONB)
 */
const insertAuditLog = async (client, { adminId, action, companyId, reason = null }) => {
    await client.query(
        `INSERT INTO admin_audit_log (admin_id, action, target_type, target_id, metadata, created_at)
         VALUES ($1, $2, 'company', $3, $4, NOW())`,
        [adminId, action, companyId, reason ? JSON.stringify({ reason }) : null]
    );
};

// ─────────────────────────────────────────────────────────────
// LIST — GET /api/v1/admin/companies
// ─────────────────────────────────────────────────────────────
const listCompanies = async ({ name, industry, size, location, status, page = 1, limit = 20 }) => {
    page  = parseInt(page)  || 1;
    limit = parseInt(limit) || 20;
    const offset = (page - 1) * limit;

    let query  = `SELECT * FROM companies WHERE 1=1`;
    let cQuery = `SELECT COUNT(*) FROM companies WHERE 1=1`;
    const values = [];

    if (status) {
        values.push(status);
        const clause = ` AND status = $${values.length}`;
        query  += clause;
        cQuery += clause;
    }
    if (name) {
        values.push(`%${name}%`);
        const clause = ` AND name ILIKE $${values.length}`;
        query  += clause;
        cQuery += clause;
    }
    if (industry) {
        values.push(industry);
        const clause = ` AND industry = $${values.length}`;
        query  += clause;
        cQuery += clause;
    }
    if (size) {
        values.push(size);
        const clause = ` AND size = $${values.length}`;
        query  += clause;
        cQuery += clause;
    }
    if (location) {
        values.push(`%${location}%`);
        const clause = ` AND location ILIKE $${values.length}`;
        query  += clause;
        cQuery += clause;
    }

    const countResult = await pool.query(cQuery, values);
    const total = parseInt(countResult.rows[0].count);

    values.push(limit);
    values.push(offset);
    query += ` ORDER BY created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`;

    const result = await pool.query(query, values);

    return { rows: result.rows, total };
};

// ─────────────────────────────────────────────────────────────
// DETAIL — GET /api/v1/admin/companies/:id
// ─────────────────────────────────────────────────────────────
const getCompanyById = async (id) => {
    const result = await pool.query(
        `SELECT
            c.id              AS "companyId",
            c.name,
            c.email,
            c.industry,
            c.size,
            c.location,
            c.status,
            c.rejection_reason  AS "rejectionReason",
            c.suspension_reason AS "suspensionReason",
            c.verified_at       AS "verifiedAt",
            c.created_at        AS "createdAt",

            json_build_object(
                'offerAcceptanceRate',  cs.offer_acceptance_rate,
                'interviewToHireRate',  cs.interview_to_hire_rate,
                'avgResponseTimeDays',  cs.avg_response_time_days,
                'totalJobsPosted',      cs.total_jobs_posted,
                'totalHires',           cs.total_hires,
                'engagementScore',      cs.engagement_score
            ) AS stats,

            (
                SELECT json_agg(activity ORDER BY activity->>'createdAt' DESC)
                FROM (
                    SELECT json_build_object(
                        'logId',       'log_' || aal.id,
                        'action',      aal.action,
                        'targetType',  aal.target_type,
                        'performedBy', u.full_name,
                        'metadata',    aal.metadata,
                        'createdAt',   aal.created_at
                    ) AS activity
                    FROM admin_audit_log aal
                    JOIN users u ON u.id = aal.admin_id
                    WHERE aal.target_type = 'company'
                      AND aal.target_id   = c.id
                    ORDER BY aal.created_at DESC
                    LIMIT 10
                ) sub
            ) AS "recentActivity"

        FROM companies c
        LEFT JOIN company_stats cs ON cs.company_id = c.id
        WHERE c.id = $1`,
        [id]
    );

    return result.rows[0] || null;
};

// ─────────────────────────────────────────────────────────────
// STATS — GET /api/v1/admin/companies/:id/stats
// ─────────────────────────────────────────────────────────────
const getCompanyStats = async (id) => {
    const result = await pool.query(
        `SELECT
            company_id              AS "companyId",
            offer_acceptance_rate   AS "offerAcceptanceRate",
            interview_to_hire_rate  AS "interviewToHireRate",
            avg_response_time_days  AS "avgResponseTimeDays",
            total_jobs_posted       AS "totalJobsPosted",
            total_hires             AS "totalHires",
            engagement_score        AS "engagementScore",
            last_updated            AS "lastUpdated"
        FROM company_stats
        WHERE company_id = $1`,
        [id]
    );

    return result.rows[0] || null;
};

// ─────────────────────────────────────────────────────────────
// DRIVES — GET /api/v1/admin/companies/:id/drives
// ─────────────────────────────────────────────────────────────
const getCompanyDrives = async (id) => {
    const result = await pool.query(
        `SELECT
            rd.id         AS "driveId",
            rd.title,
            rd.status,
            rd.created_at AS "createdAt"
        FROM recruitment_drives rd
        WHERE rd.company_id = $1
        ORDER BY rd.created_at DESC`,
        [id]
    );

    return result.rows;
};

// ─────────────────────────────────────────────────────────────
// APPROVE — POST /api/v1/admin/companies/:id/approve
// ─────────────────────────────────────────────────────────────
const approveCompany = async (id, adminId) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const existing = await client.query(
            `SELECT * FROM companies WHERE id = $1`,
            [id]
        );

        if (existing.rows.length === 0) {
            await client.query('ROLLBACK');
            return null;
        }

        const company = existing.rows[0];

        if (company.status === 'approved') {
            await client.query('ROLLBACK');
            const err = new Error('Company is already approved.');
            err.code  = 'INVALID_STATE';
            err.statusCode = 409;
            throw err;
        }

        if (company.status !== 'pending') {
            await client.query('ROLLBACK');
            const err = new Error(`Cannot approve a company with status '${company.status}'.`);
            err.code  = 'INVALID_STATE';
            err.statusCode = 409;
            throw err;
        }

        const result = await client.query(
            `UPDATE companies
             SET status            = 'approved',
                 verified_at       = NOW(),
                 rejection_reason  = NULL,
                 suspension_reason = NULL
             WHERE id = $1
             RETURNING
                 id          AS "companyId",
                 name,
                 email,
                 status,
                 verified_at AS "verifiedAt"`,
            [id]
        );

        await insertAuditLog(client, { adminId, action: 'approved', companyId: id });

        await client.query('COMMIT');
        return result.rows[0];

    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

// ─────────────────────────────────────────────────────────────
// REJECT — POST /api/v1/admin/companies/:id/reject
// ─────────────────────────────────────────────────────────────
const rejectCompany = async (id, reason, adminId) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const existing = await client.query(
            `SELECT * FROM companies WHERE id = $1`,
            [id]
        );

        if (existing.rows.length === 0) {
            await client.query('ROLLBACK');
            return null;
        }

        const company = existing.rows[0];

        if (company.status !== 'pending') {
            await client.query('ROLLBACK');
            const err = new Error(`Only pending companies can be rejected. Current status: '${company.status}'.`);
            err.code  = 'INVALID_STATE';
            err.statusCode = 409;
            throw err;
        }

        const result = await client.query(
            `UPDATE companies
             SET status           = 'rejected',
                 rejection_reason = $2,
                 suspension_reason = NULL
             WHERE id = $1
             RETURNING
                 id               AS "companyId",
                 name,
                 email,
                 status,
                 rejection_reason AS "rejectionReason"`,
            [id, reason]
        );

        await insertAuditLog(client, { adminId, action: 'rejected', companyId: id, reason });

        await client.query('COMMIT');
        return result.rows[0];

    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

// ─────────────────────────────────────────────────────────────
// SUSPEND — POST /api/v1/admin/companies/:id/suspend
// ─────────────────────────────────────────────────────────────
const suspendCompany = async (id, reason, adminId) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const existing = await client.query(
            `SELECT * FROM companies WHERE id = $1`,
            [id]
        );

        if (existing.rows.length === 0) {
            await client.query('ROLLBACK');
            return null;
        }

        const company = existing.rows[0];

        if (company.status !== 'approved') {
            await client.query('ROLLBACK');
            const err = new Error(`Only approved companies can be suspended. Current status: '${company.status}'.`);
            err.code  = 'INVALID_STATE';
            err.statusCode = 409;
            throw err;
        }

        const result = await client.query(
            `UPDATE companies
             SET status            = 'suspended',
                 suspension_reason = $2
             WHERE id = $1
             RETURNING
                 id                AS "companyId",
                 name,
                 email,
                 status,
                 suspension_reason AS "suspensionReason"`,
            [id, reason]
        );

        await insertAuditLog(client, { adminId, action: 'suspended', companyId: id, reason });

        await client.query('COMMIT');
        return result.rows[0];

    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

// ─────────────────────────────────────────────────────────────
// REINSTATE — POST /api/v1/admin/companies/:id/reinstate
// ─────────────────────────────────────────────────────────────
const reinstateCompany = async (id, adminId) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const existing = await client.query(
            `SELECT * FROM companies WHERE id = $1`,
            [id]
        );

        if (existing.rows.length === 0) {
            await client.query('ROLLBACK');
            return null;
        }

        const company = existing.rows[0];

        if (company.status !== 'suspended') {
            await client.query('ROLLBACK');
            const err = new Error(`Only suspended companies can be reinstated. Current status: '${company.status}'.`);
            err.code  = 'INVALID_STATE';
            err.statusCode = 409;
            throw err;
        }

        const result = await client.query(
            `UPDATE companies
             SET status            = 'approved',
                 suspension_reason = NULL
             WHERE id = $1
             RETURNING
                 id          AS "companyId",
                 name,
                 email,
                 status,
                 verified_at AS "verifiedAt"`,
            [id]
        );

        await insertAuditLog(client, { adminId, action: 'reinstated', companyId: id });

        await client.query('COMMIT');
        return result.rows[0];

    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

// ─────────────────────────────────────────────────────────────
// RANKINGS — GET /api/v1/admin/companies/rankings
// ─────────────────────────────────────────────────────────────
const getCompanyRankings = async (limit = 20) => {
    limit = parseInt(limit) || 20;

    const result = await pool.query(
        `SELECT
            ROW_NUMBER() OVER (ORDER BY cs.engagement_score DESC) AS rank,
            c.id                    AS "companyId",
            c.name,
            c.industry,
            cs.engagement_score     AS "engagementScore",
            cs.total_hires          AS "totalHires",
            cs.offer_acceptance_rate AS "offerAcceptanceRate",
            cs.interview_to_hire_rate AS "interviewToHireRate"
        FROM companies c
        JOIN company_stats cs ON cs.company_id = c.id
        WHERE c.status = 'approved'
        ORDER BY cs.engagement_score DESC
        LIMIT $1`,
        [limit]
    );

    return result.rows;
};

// ─────────────────────────────────────────────────────────────
// ACTIVE DRIVES — GET /api/v1/admin/companies/active-drives
// ─────────────────────────────────────────────────────────────
const getActiveDrives = async () => {
    const result = await pool.query(
        `SELECT
            c.id          AS "companyId",
            c.name        AS "companyName",
            c.industry,
            rd.id         AS "driveId",
            rd.title      AS "driveTitle",
            rd.status     AS "driveStatus",
            rd.created_at AS "driveCreatedAt"
        FROM companies c
        JOIN recruitment_drives rd ON rd.company_id = c.id
        WHERE rd.status = 'active'
        ORDER BY rd.created_at DESC`
    );

    return result.rows;
};

export {
    listCompanies,
    getCompanyById,
    getCompanyStats,
    getCompanyDrives,
    approveCompany,
    rejectCompany,
    suspendCompany,
    reinstateCompany,
    getCompanyRankings,
    getActiveDrives,
};
