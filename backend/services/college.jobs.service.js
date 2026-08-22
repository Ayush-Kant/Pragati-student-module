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

    const company = await pool.query(
        `
        SELECT id
        FROM companies
        WHERE name = $1
        `,
        [jobData.company]
    );

    if (company.rows.length === 0) {
        throw new Error("Company not found");
    }

    const payload = {
        company_id: company.rows[0].id,
        role: jobData.role,
        department: jobData.department,
        location: jobData.location,
        package: jobData.package,
        cgpa_limit: parseFloat(jobData.cgpa),
        batch: jobData.batch,
        application_deadline: jobData.deadline,
        job_description: jobData.jobDescription,
        hiring_process: jobData.hiringProcess,
        status: "Open",
    };
    console.log("JOB PAYLOAD:", payload);
    return await jobModel.createJobPosting(payload);
};

const editJobPosting = async (id, jobData) => {

    const payload = {

        company_id: jobData.company_id,

        role: jobData.role,

        department: jobData.department,

        location: jobData.location,

        package: jobData.package,


        cgpa_limit: Number(
            jobData.cgpa_limit ?? jobData.cgpa
        ),


        batch: jobData.batch,


        application_deadline:
            jobData.application_deadline ?? jobData.deadline,


        job_description:
            jobData.job_description ?? jobData.jobDescription,


        hiring_process:
            jobData.hiring_process ?? jobData.hiringProcess,


        status: jobData.status || "Open"

    };


    console.log("SERVICE UPDATE PAYLOAD:", payload);


    return await jobModel.updateJobPosting(id, payload);
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