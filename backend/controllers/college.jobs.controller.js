import * as service from '../services/college.jobs.service.js';

/* ===========================
   Jobs
=========================== */

const getAllJobs = async (req, res) => {
    try {
        const jobs = await service.getAllJobs();

        res.status(200).json({
            jobs,
            total: jobs.length,
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};

const getJobById = async (req, res) => {
    try {
        const job = await service.getJobById(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        res.status(200).json(job);
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};

const createJob = async (req, res) => {
    try {
        const jobId = await service.createJob(req.body);

        res.status(201).json({
            message: "Job Created Successfully",
            jobId,
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};

/* ===========================
   Job Postings
=========================== */

const getJobPostings = async (req, res) => {
    try {
        const jobs = await service.getJobPostings();

        res.status(200).json({
            success: true,
            total: jobs.length,
            data: jobs,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const getJobPostingById = async (req, res) => {
    try {
        const job = await service.getJobPosting(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        res.status(200).json({
            success: true,
            data: job,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const createJobPosting = async (req, res) => {
    try {
        const job = await service.addJobPosting(req.body);

        res.status(201).json({
            success: true,
            message: "Job created successfully",
            data: job,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const updateJobPosting = async (req, res) => {
    try {
        const job = await service.editJobPosting(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            data: job,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const deleteJobPosting = async (req, res) => {
    try {
        await service.removeJobPosting(req.params.id);

        res.status(200).json({
            success: true,
            message: "Job deleted successfully",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const publishJobPosting = async (req, res) => {
    try {
        const job = await service.publishJobPosting(req.params.id);

        res.status(200).json({
            success: true,
            message: "Job published successfully",
            data: job,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const closeJobPosting = async (req, res) => {
    try {
        const job = await service.closeJobPosting(req.params.id);

        res.status(200).json({
            success: true,
            message: "Job closed successfully",
            data: job,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

/* ===========================
   Eligibility
=========================== */

const getEligibility = async (req, res) => {
    try {
        const eligibility = await service.getEligibility(req.params.id);

        res.status(200).json({
            success: true,
            data: eligibility,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const createEligibility = async (req, res) => {
    try {
        const eligibility = await service.addEligibility(req.body);

        res.status(201).json({
            success: true,
            message: "Eligibility created successfully",
            data: eligibility,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const updateEligibility = async (req, res) => {
    try {
        const eligibility = await service.updateEligibility(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Eligibility updated successfully",
            data: eligibility,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const deleteEligibility = async (req, res) => {
    try {
        await service.removeEligibility(req.params.id);

        res.status(200).json({
            success: true,
            message: "Eligibility deleted successfully",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export {
    // Jobs
    getAllJobs,
    getJobById,
    createJob,

    // Job Posting
    getJobPostings,
    getJobPostingById,
    createJobPosting,
    updateJobPosting,
    deleteJobPosting,
    publishJobPosting,
    closeJobPosting,

    // Eligibility
    getEligibility,
    createEligibility,
    updateEligibility,
    deleteEligibility,
};