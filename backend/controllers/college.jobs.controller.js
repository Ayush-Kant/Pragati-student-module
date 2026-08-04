import * as service from '../services/college.jobs.service.js';


/* ===========================
   Company
=========================== */

const getCompanies = async (req, res) => {
    try {
        const companies = await service.getCompanies();

        res.status(200).json({
            success: true,
            total: companies.length,
            data: companies,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const getCompanyById = async (req, res) => {
    try {
        const company = await service.getCompany(req.params.id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }

        res.status(200).json({
            success: true,
            data: company,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const createCompany = async (req, res) => {
    try {

        console.log("Company Request Body:", req.body);

        const company = await service.addCompany(req.body);

        console.log("Inserted Company:", company);

        res.status(201).json({
            success: true,
            message: "Company created successfully",
            data: company,
        });

    } catch (err) {

        console.error("Create Company Error:", err);

        res.status(500).json({
            success:false,
            message:err.message
        });
    }
};

const updateCompany = async (req, res) => {
    try {
        const company = await service.editCompany(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Company updated successfully",
            data: company,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const deleteCompany = async (req, res) => {
    try {
        await service.removeCompany(req.params.id);

        res.status(200).json({
            success: true,
            message: "Company deleted successfully",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


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

        console.log("CREATE JOB BODY:", req.body);

        const job = await service.addJobPosting(req.body);

        res.status(201).json({
            success: true,
            message: "Job created successfully",
            data: job,
        });

    } catch (err) {

        console.error("CREATE JOB ERROR:", err);

        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const updateJobPosting = async (req, res) => {

    try {

        const existingJob =
            await service.getJobPosting(req.params.id);


        const updatedJob = {

            company_id:
                existingJob.company_id,


            role:
                req.body.role ?? existingJob.role,


            department:
                req.body.department ?? existingJob.department,


            location:
                req.body.location ?? existingJob.location,


            package:
                req.body.package ?? existingJob.package,


            cgpa_limit:
                Number(
                    req.body.cgpa_limit ??
                    existingJob.cgpa_limit
                ),


            batch:
                req.body.batch ?? existingJob.batch,


            application_deadline:
                req.body.application_deadline ??
                existingJob.application_deadline,


            job_description:
                req.body.job_description ??
                existingJob.job_description,


            hiring_process:
                req.body.hiring_process ??
                existingJob.hiring_process,


            status:
                req.body.status ?? existingJob.status
        };


        console.log(
            "FINAL UPDATE DATA:",
            updatedJob
        );


        const job =
            await service.editJobPosting(
                req.params.id,
                updatedJob
            );


        res.status(200).json({
            success:true,
            message:"Job updated successfully",
            data:job
        });


    } catch(err){

        console.log(
            "UPDATE JOB ERROR:",
            err
        );

        res.status(500).json({
            success:false,
            message:err.message
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

// ===============================
// Hiring Rounds
// ===============================
export const createRound = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            round_name,
            round_order,
            description
        } = req.body;


        const round = await service.createRound(
            id,
            round_name,
            round_order,
            description
        );


        res.status(201).json({
            success: true,
            message: "Hiring round created successfully",
            data: round
        });


    } catch(error) {

        console.error("Create Round Error:", error);

        res.status(500).json({
            success:false,
            message:"Failed to create hiring round"
        });

    }
};
export const getRounds = async (req, res) => {

    try {

        const { id } = req.params;

        const rounds = await service.getRounds(id);

        res.status(200).json({
            success: true,
            data: rounds
        });


    } catch(error) {

        console.error("Get Rounds Error:", error);

        res.status(500).json({
            success:false,
            message:"Failed to fetch hiring rounds"
        });

    }
};
export const updateRound = async (req, res) => {

    try {

        const { roundId } = req.params;

        const {
            round_name,
            round_order,
            description
        } = req.body;


        const round = await service.updateRound(
            roundId,
            round_name,
            round_order,
            description
        );


        res.status(200).json({
            success: true,
            message: "Hiring round updated successfully",
            data: round
        });


    } catch(error) {

        console.error("Update Round Error:", error);

        res.status(500).json({
            success:false,
            message:"Failed to update hiring round"
        });

    }
};
export const deleteRound = async (req, res) => {

    try {

        const { roundId } = req.params;


        await service.deleteRound(roundId);


        res.status(200).json({
            success: true,
            message: "Hiring round deleted successfully"
        });


    } catch(error) {

        console.error("Delete Round Error:", error);

        res.status(500).json({
            success:false,
            message:"Failed to delete hiring round"
        });

    }
};


export {

    // Company
    getCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,

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