import { pool } from '../config/db.js';
import {
    REPORT_FORMATS,
    REPORT_STATUSES,
    REPORT_TYPES,
} from '../constants/collegeReportsGeneration.constants.js';

const seedReportTemplates = async () => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        await client.query(`
            CREATE TABLE IF NOT EXISTS report_templates (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                type VARCHAR(100) NOT NULL,
                format VARCHAR(50) NOT NULL DEFAULT 'json',
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS report_categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                slug VARCHAR(100) NOT NULL UNIQUE,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        `);

        await client.query(`
            INSERT INTO report_categories (name, slug)
            VALUES ('Dashboard', 'dashboard'), ('Placements', 'placements'), ('Students', 'students'), ('Drives', 'drives')
            ON CONFLICT (slug) DO NOTHING
        `);

        const templates = [
            {
                name: 'Dashboard Summary',
                type: REPORT_TYPES.DASHBOARD,
                format: REPORT_FORMATS.JSON,
            },
            {
                name: 'Placement Overview',
                type: REPORT_TYPES.PLACEMENTS,
                format: REPORT_FORMATS.PDF,
            },
            {
                name: 'Student Progress',
                type: REPORT_TYPES.STUDENTS,
                format: REPORT_FORMATS.CSV,
            },
        ];

        for (const template of templates) {
            await client.query(
                `
                INSERT INTO report_templates (name, type, format, is_active)
                VALUES ($1, $2, $3, TRUE)
                ON CONFLICT (name) DO NOTHING
                `,
                [template.name, template.type, template.format]
            );
        }

        await client.query('COMMIT');
        console.log('Reports generation seed completed successfully');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Reports generation seed failed:', error);
        throw error;
    } finally {
        client.release();
    }
};

const runSeed = async () => {
    try {
        await seedReportTemplates();
    } catch (error) {
        process.exitCode = 1;
    }
};

runSeed();
