import { pool } from '../config/db.js';

/* ==========================================
   Company Model
========================================== */

const getAllCompanies = async () => {

    const result = await pool.query(`
        SELECT
            id,
            name,
            location,
            package,
            status,
            created_at AS "createdAt"
        FROM companies
        ORDER BY id DESC
    `);

    return result.rows;
};

const getCompanyById = async (id) => {

    const result = await pool.query(
        `
        SELECT
            id,
            name,
            location,
            package,
            status,
            created_at AS "createdAt"
        FROM companies
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0];
};

const createCompany = async ({
    name,
    location,
    package: packageValue
}) => {

    const result = await pool.query(
        `
        INSERT INTO companies
        (
            name,
            location,
            package
        )
        VALUES
        (
            $1,$2,$3
        )
        RETURNING *
        `,
        [
            name,
            location,
            packageValue
        ]
    );

    return result.rows[0];
};
const updateCompany = async (
    id,
    {
        name,
        location,
        package: packageValue
    }
) => {

    const result = await pool.query(
        `
        UPDATE companies
        SET
            name=$1,
            location=$2,
            package=$3,
            updated_at=NOW()
        WHERE id=$4
        RETURNING *
        `,
        [
            name,
            location,
            packageValue,
            id
        ]
    );

    return result.rows[0];
};

const deleteCompany = async (id) => {

    await pool.query(
        `
        DELETE FROM companies
        WHERE id=$1
        `,
        [id]
    );

    return true;
};

const searchCompanies = async (keyword) => {

    const result = await pool.query(
        `
        SELECT *
        FROM companies
        WHERE
            name ILIKE $1
            OR location ILIKE $1
            OR package ILIKE $1
        `,
        [`%${keyword}%`]
    );

    return result.rows;
};

/* ==========================================
   Job Posting Model
========================================== */

const getAllJobPostings = async () => {

    const result = await pool.query(`
        SELECT *
        FROM job_postings
        ORDER BY id DESC
    `);

    return result.rows;
};

const getJobPostingById = async (id) => {

    const result = await pool.query(
        `
        SELECT *
        FROM job_postings
        WHERE id=$1
        `,
        [id]
    );

    return result.rows[0];
};

const createJobPosting = async (job) => {

    const result = await pool.query(
        `
        INSERT INTO job_postings
        (
            company_id,
            title,
            description,
            job_type,
            location,
            salary_min,
            salary_max,
            experience_required,
            status,
            posted_at
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,NOW()
        )
        RETURNING *
        `,
        [
            job.company_id,
            job.title,
            job.description,
            job.job_type,
            job.location,
            job.salary_min,
            job.salary_max,
            job.experience_required,
            job.status || "Open",
        ]
    );

    return result.rows[0];
};

const updateJobPosting = async (id, job) => {

    const result = await pool.query(
        `
        UPDATE job_postings
        SET
            title=$1,
            description=$2,
            job_type=$3,
            location=$4,
            salary_min=$5,
            salary_max=$6,
            experience_required=$7,
            status=$8
        WHERE id=$9
        RETURNING *
        `,
        [
            job.title,
            job.description,
            job.job_type,
            job.location,
            job.salary_min,
            job.salary_max,
            job.experience_required,
            job.status,
            id,
        ]
    );

    return result.rows[0];
};

const deleteJobPosting = async (id) => {

    await pool.query(
        `
        DELETE FROM job_postings
        WHERE id=$1
        `,
        [id]
    );

    return true;
};

const getOpenJobs = async () => {

    const result = await pool.query(`
        SELECT *
        FROM job_postings
        WHERE status='Open'
    `);

    return result.rows;
};

const getClosedJobs = async () => {

    const result = await pool.query(`
        SELECT *
        FROM job_postings
        WHERE status='Closed'
    `);

    return result.rows;
};

/* ==========================================
   Eligibility Model
========================================== */

const getEligibility = async (jobId) => {

    const result = await pool.query(
        `
        SELECT *
        FROM job_eligibility
        WHERE job_id = $1
        `,
        [jobId]
    );

    return result.rows[0];
};

const createEligibility = async (data) => {

    const result = await pool.query(
        `
        INSERT INTO job_eligibility
        (
            job_id,
            qualification,
            min_percentage,
            max_backlogs,
            allowed_batch_year,
            gender_preference
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6
        )
        RETURNING *
        `,
        [
            data.job_id,
            data.qualification,
            data.min_percentage,
            data.max_backlogs,
            data.allowed_batch_year,
            data.gender_preference,
        ]
    );

    return result.rows[0];
};

const updateEligibility = async (jobId, data) => {

    const result = await pool.query(
        `
        UPDATE job_eligibility
        SET
            qualification = $1,
            min_percentage = $2,
            max_backlogs = $3,
            allowed_batch_year = $4,
            gender_preference = $5
        WHERE job_id = $6
        RETURNING *
        `,
        [
            data.qualification,
            data.min_percentage,
            data.max_backlogs,
            data.allowed_batch_year,
            data.gender_preference,
            jobId,
        ]
    );

    return result.rows[0];
};

const deleteEligibility = async (jobId) => {

    await pool.query(
        `
        DELETE FROM job_eligibility
        WHERE job_id = $1
        `,
        [jobId]
    );

    return true;
};
export {

    // Company
    getAllCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
    searchCompanies,

    // Job Posting
    getAllJobPostings,
    getJobPostingById,
    createJobPosting,
    updateJobPosting,
    deleteJobPosting,
    getOpenJobs,
    getClosedJobs,

    // Eligibility
    getEligibility,
    createEligibility,
    updateEligibility,
    deleteEligibility,
};