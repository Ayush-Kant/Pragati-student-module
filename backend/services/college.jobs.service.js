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

export {
    // Jobs
    getAllJobs,
    getJobById,
    createJob,

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