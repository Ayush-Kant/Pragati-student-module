// admin.company.service.js

import { pool } from '../config/db.js';

const getAllCompanies = async ({name,industry,size,location,status,page = 1,limit = 20,}) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;

    const offset = (page - 1) * limit;

    let query = ` SELECT * FROM companies WHERE 1=1`;
    let values = [];

    if (name) {
        values.push(`%${name}%`);
        query += ` AND name ILIKE $${values.length}`;
    }

    if (industry) {
        values.push(`%${industry}%`);
        query += ` AND industry ILIKE $${values.length}`;
    }
    if (size) {
        values.push(size);
        query += ` AND size = $${values.length}`;
    }

    if (location) {
        values.push(`%${location}%`);
        query += ` AND location ILIKE $${values.length}`;
    }

    if (status) {
        values.push(status);
        query += ` AND status = $${values.length}`;
    }
    values.push(limit);
    values.push(offset);

    query += ` ORDER BY created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`;

    const result = await pool.query(query,values);

    return result.rows;
};

const getCompanyById = async (id) => {

    const result = await pool.query(
        `
        SELECT
            c.id AS "companyId",
            c.name,
            c.email,
            c.industry,
            c.size,
            c.location,
            c.status,
            c.rejection_reason AS "rejectionReason",
            c.suspension_reason AS "suspensionReason",
            c.created_at AS "createdAt",

            json_build_object(
                'offerAcceptanceRate', s.offer_acceptance_rate,
                'interviewToHireRate', s.interview_to_hire_rate,
                'avgResponseTime', s.avg_response_time,
                'totalJobsPosted', s.total_jobs_posted,
                'totalHires', s.total_hires,
                'engagementScore', s.engagement_score
            ) AS stats,

            (
                SELECT json_agg(logs)
                FROM (
                    SELECT
                        action,
                        reason,
                        performed_by AS "performedBy",
                        created_at AS "createdAt"
                    FROM audit_logs
                    WHERE
                        entity_type = 'company'
                        AND entity_id = c.id
                    ORDER BY created_at DESC
                    LIMIT 10
                ) logs
            ) AS "recentActivity"

        FROM companies c

        LEFT JOIN company_stats s
        ON c.id = s.company_id

        WHERE c.id = $1
        `,
        [id]
    );

    return result.rows[0];
};

const getCompanyStats = async (id) => {

    const result = await pool.query(
        `
        SELECT
            company_id AS "companyId",
            offer_acceptance_rate AS "offerAcceptanceRate",
            interview_to_hire_rate AS "interviewToHireRate",
            avg_response_time AS "avgResponseTime",
            total_jobs_posted AS "totalJobsPosted",
            total_hires AS "totalHires",
            engagement_score AS "engagementScore"
        FROM company_stats
        WHERE company_id = $1
        `,
        [id]
    );
    return result.rows[0];
};

const getCompanyDrives = async (id) => {

    const result = await pool.query(
        `
        SELECT
            d.id AS "driveId",
            d.title,
            d.status,
            d.location,
            d.start_date AS "startDate",
            d.end_date AS "endDate"
        FROM drives d
        WHERE d.company_id = $1
        ORDER BY d.created_at DESC
        `,
        [id]
    );

    return result.rows;
};

const createAuditLog = async (client,{entity_type,entity_id,action,performed_by,reason = null,}) => {

    await client.query(
        `
        INSERT INTO audit_logs
        (
            entity_type,
            entity_id,
            action,
            performed_by,
            reason,
            created_at
        )
        VALUES ($1, $2, $3, $4, $5, NOW())
        `,
        [
            entity_type,
            entity_id,
            action,
            performed_by,
            reason,
        ]
    );
};

const approveCompany = async (id,adminId) => {

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        const existing = await client.query(
            `
            SELECT *
            FROM companies
            WHERE id = $1
            `,
            [id]
        );

        if (existing.rows.length === 0) {
            await client.query('ROLLBACK');
            return null;
        }

        const company = existing.rows[0];

        if (company.status === 'approved') {
            await client.query('ROLLBACK');

            return {
                alreadyApproved: true,
            };
        }

        if (company.status !== 'pending') {
            await client.query('ROLLBACK');
            throw new Error(
                'Only pending companies can be approved.'
            );
        }

        const result = await client.query(
            `
            UPDATE companies
            SET
                status = 'approved',
                rejection_reason = NULL,
                suspension_reason = NULL
            WHERE id = $1
            RETURNING
                id AS "companyId",
                name,
                email,
                status
            `,
            [id]
        );
        await createAuditLog(
            client,
            {
                entity_type: 'company',
                entity_id: id,
                action: 'approved',
                performed_by: adminId,
            }
        );

        await client.query('COMMIT');
        return result.rows[0];

    }
    catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

const rejectCompany = async (id,reason,adminId) => {

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const existing = await client.query(
            `
            SELECT *
            FROM companies
            WHERE id = $1
            `,
            [id]
        );

        if (existing.rows.length === 0) {
            await client.query('ROLLBACK');
            return null;
        }
        const company = existing.rows[0];

        if (company.status !== 'pending') {
            await client.query('ROLLBACK');

            throw new Error(
                'Only pending companies can be rejected.'
            );
        }

        const result = await client.query(
            `
            UPDATE companies
            SET
                status = 'rejected',
                rejection_reason = $2,
                suspension_reason = NULL
            WHERE id = $1
            RETURNING
                id AS "companyId",
                name,
                email,
                status,
                rejection_reason AS "rejectionReason"
            `,
            [id, reason]
        );
        await createAuditLog(
            client,
            {
                entity_type: 'company',
                entity_id: id,
                action: 'rejected',
                performed_by: adminId,
                reason,
            }
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

const suspendCompany = async (id,reason,adminId) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const existing = await client.query(
            `
            SELECT *
            FROM companies
            WHERE id = $1
            `,
            [id]
        );

        if (existing.rows.length === 0) {
            await client.query('ROLLBACK');
            return null;
        }

        const company = existing.rows[0];

        if (company.status !== 'approved') {
            await client.query('ROLLBACK');
            throw new Error(
                'Only approved companies can be suspended.'
            );
        }

        const result = await client.query(
            `
            UPDATE companies
            SET
                status = 'suspended',
                suspension_reason = $2
            WHERE id = $1
            RETURNING
                id AS "companyId",
                name,
                email,
                status,
                suspension_reason AS "suspensionReason"
            `,
            [id, reason]
        );
        await createAuditLog(
            client,
            {
                entity_type: 'company',
                entity_id: id,
                action: 'suspended',
                performed_by: adminId,
                reason,
            }
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

const reinstateCompany = async (id,adminId) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const existing = await client.query(
            `
            SELECT *
            FROM companies
            WHERE id = $1
            `,
            [id]
        );

        if (existing.rows.length === 0) {
            await client.query('ROLLBACK');
            return null;
        }

        const company = existing.rows[0];

        if (company.status !== 'suspended') {
            await client.query('ROLLBACK');

            throw new Error(
                'Only suspended companies can be reinstated.'
            );
        }
        const result = await client.query(
            `
            UPDATE companies
            SET
                status = 'approved',
                suspension_reason = NULL
            WHERE id = $1
            RETURNING
                id AS "companyId",
                name,
                email,
                status
            `,
            [id]
        );
        await createAuditLog(
            client,
            {
                entity_type: 'company',
                entity_id: id,
                action: 'reinstated',
                performed_by: adminId,
            }
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

const getCompanyRankings = async (limit = 20) => {

    limit = parseInt(limit) || 20;
    const result = await pool.query(
        `
        SELECT
            ROW_NUMBER() OVER (
                ORDER BY s.engagement_score DESC
            ) AS rank,

            c.id AS "companyId",
            c.name,

            s.engagement_score AS "engagementScore",
            s.total_jobs_posted AS "totalJobsPosted",
            s.total_hires AS "totalHires",
            s.offer_acceptance_rate AS "offerAcceptanceRate"

        FROM companies c

        JOIN company_stats s
        ON c.id = s.company_id

        WHERE c.status = 'approved'

        ORDER BY s.engagement_score DESC

        LIMIT $1
        `,
        [limit]
    );
    return result.rows;
};

const getActiveDriveCompanies = async () => {
    const result = await pool.query(
        `
        SELECT
            c.id AS "companyId",
            c.name,
            c.email,
            c.industry,

            d.id AS "driveId",
            d.title AS "driveTitle",
            d.location,
            d.start_date AS "startDate",
            d.end_date AS "endDate"

        FROM companies c

        JOIN drives d
        ON c.id = d.company_id

        WHERE d.status = 'active'

        ORDER BY d.created_at DESC
        `
    );
    return result.rows;
};

export {
    getAllCompanies,
    getCompanyById,
    getCompanyStats,
    getCompanyDrives,
    approveCompany,
    rejectCompany,
    suspendCompany,
    reinstateCompany,
    getCompanyRankings,
    getActiveDriveCompanies,
};