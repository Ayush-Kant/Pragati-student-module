import { pool } from '../config/db.js';
import * as jobModel from '../models/jobs.model.js';

/* ===========================
   Jobs
=========================== */

const getAllJobs = async () => {

    const result = await pool.query(`
        SELECT
            id AS "jobId",
            company_id AS "companyId",
            title,
            description,
            eligibility,
            status,
            deadline
        FROM jobs
        ORDER BY id DESC
    `);

    return result.rows;
};

const getJobById = async (id) => {

    const result = await pool.query(
        `
        SELECT
            id AS "jobId",
            company_id AS "companyId",
            title,
            description,
            eligibility,
            status,
            deadline
        FROM jobs
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0];
};

const createJob = async ({
    company_id,
    title,
    description,
    eligibility,
    status,
    deadline,
}) => {

    const result = await pool.query(
        `
        INSERT INTO jobs
        (
            company_id,
            title,
            description,
            eligibility,
            status,
            deadline
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6
        )
        RETURNING id
        `,
        [
            company_id,
            title,
            description,
            eligibility,
            status || 'open',
            deadline,
        ]
    );

    return result.rows[0].id;
};

const getCompanies = async () => {
    return await jobModel.getAllCompanies();
};

const getCompany = async (id) => {
    return await jobModel.getCompanyById(id);
};

const addCompany = async (data) => {
    return await jobModel.createCompany(data);
};

const editCompany = async (id, data) => {
    return await jobModel.updateCompany(id, data);
};

const removeCompany = async (id) => {
    return await jobModel.deleteCompany(id);
};

/* ===========================
   Job Posting
=========================== */

const getJobPostings = async () => {
    return await jobModel.getAllJobPostings();
};

const getJobPosting = async (id) => {
    return await jobModel.getJobPostingById(id);
};

const addJobPosting = async (jobData) => {
    return await jobModel.createJobPosting(jobData);
};

const editJobPosting = async (id, jobData) => {
    return await jobModel.updateJobPosting(id, jobData);
};

const removeJobPosting = async (id) => {
    return await jobModel.deleteJobPosting(id);
};

const publishJobPosting = async (id) => {

    const job = await jobModel.getJobPostingById(id);

    if (!job) {
        throw new Error("Job Posting not found");
    }

    job.status = "Open";

    return await jobModel.updateJobPosting(id, job);
};

const closeJobPosting = async (id) => {

    const job = await jobModel.getJobPostingById(id);

    if (!job) {
        throw new Error("Job Posting not found");
    }

    job.status = "Closed";

    return await jobModel.updateJobPosting(id, job);
};

const getOpenJobs = async () => {
    return await jobModel.getOpenJobs();
};

const getClosedJobs = async () => {
    return await jobModel.getClosedJobs();
};

/* ===========================
   Eligibility
=========================== */

const getEligibility = async (jobPostingId) => {
    return await jobModel.getEligibility(jobPostingId);
};

const addEligibility = async (data) => {
    return await jobModel.createEligibility(data);
};

const updateEligibility = async (jobPostingId, data) => {
    return await jobModel.updateEligibility(jobPostingId, data);
};

const removeEligibility = async (jobPostingId) => {
    return await jobModel.deleteEligibility(jobPostingId);
};

export const createRound = async (
    job_posting_id,
    round_name,
    round_order,
    description
) => {

    const result = await pool.query(
        `
        INSERT INTO hiring_rounds
        (
            job_posting_id,
            round_name,
            round_order,
            description
        )
        VALUES ($1,$2,$3,$4)
        RETURNING *
        `,
        [
            job_posting_id,
            round_name,
            round_order,
            description
        ]
    );

    return result.rows[0];
};
export const getRounds = async (job_posting_id) => {

    const result = await pool.query(
        `
        SELECT *
        FROM hiring_rounds
        WHERE job_posting_id = $1
        ORDER BY round_order ASC
        `,
        [job_posting_id]
    );

    return result.rows;
};
export const updateRound = async (
    id,
    round_name,
    round_order,
    description
) => {

    const result = await pool.query(
        `
        UPDATE hiring_rounds
        SET
            round_name = $1,
            round_order = $2,
            description = $3
        WHERE id = $4
        RETURNING *
        `,
        [
            round_name,
            round_order,
            description,
            id
        ]
    );

    return result.rows[0];
};
export const deleteRound = async (id) => {

    const result = await pool.query(
        `
        DELETE FROM hiring_rounds
        WHERE id = $1
        RETURNING *
        `,
        [id]
    );

    return result.rows[0];
};

export {
    // Jobs
    getAllJobs,
    getJobById,
    createJob,

    // Company
    getCompanies,
    getCompany,
    addCompany,
    editCompany,
    removeCompany,

    // Job Posting
    getJobPostings,
    getJobPosting,
    addJobPosting,
    editJobPosting,
    removeJobPosting,
    publishJobPosting,
    closeJobPosting,
    getOpenJobs,
    getClosedJobs,

    // Eligibility
    getEligibility,
    addEligibility,
    updateEligibility,
    removeEligibility,
};