/* ===========================
   Common Validators
=========================== */

const validateRequestBody = (req, res, next) => {

    if (
        !req.body ||
        Object.keys(req.body).length === 0
    ) {
        return res.status(400).json({
            message: "Request body cannot be empty",
        });
    }

    next();
};

const sanitizeInput = (req, res, next) => {

    Object.keys(req.body).forEach((key) => {

        if (typeof req.body[key] === "string") {
            req.body[key] = req.body[key].trim();
        }

    });

    next();
};

/* ===========================
   Jobs Validators
=========================== */

const validateJobId = (req, res, next) => {

    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({
            message: "Invalid Job ID",
        });
    }

    next();
};

const validateCreateJob = (req, res, next) => {

    const {
        company_id,
        title,
        deadline,
    } = req.body;

    if (!company_id) {
        return res.status(400).json({
            message: "Company ID is required",
        });
    }

    if (!title || title.trim() === "") {
        return res.status(400).json({
            message: "Job title is required",
        });
    }

    if (!deadline) {
        return res.status(400).json({
            message: "Deadline is required",
        });
    }

    next();
};

/* ===========================
   Job Posting Validators
=========================== */

const validateJobPosting = (req, res, next) => {
    console.log("VALIDATOR BODY:", req.body);
    const {
        role,
        company,
        department,
        location,
        package: pkg,
        cgpa,
        batch,
        deadline,
        jobDescription,
        hiringProcess
    } = req.body;


    if (!role)
        return res.status(400).json({
            message: "Job role is required"
        });


    if (!company)
        return res.status(400).json({
            message: "Company is required"
        });


    if (!department)
        return res.status(400).json({
            message: "Department is required"
        });


    if (!location)
        return res.status(400).json({
            message: "Location is required"
        });


    if (!pkg)
        return res.status(400).json({
            message: "Package is required"
        });


    const packageRegex = /^(\d+(\.\d+)?)\s*(LPA)?$/i;

    if (!packageRegex.test(pkg)) {
        return res.status(400).json({
            message: "Package format should be like 10 LPA"
        });
    }


    const cgpaValue = Number(cgpa);

    if (!cgpa || isNaN(cgpaValue)) {
        return res.status(400).json({
            message: "Valid CGPA is required"
        });
    }


    if (cgpaValue < 0 || cgpaValue > 10) {
        return res.status(400).json({
            message: "CGPA must be between 0 and 10"
        });
    }


    if (!batch)
        return res.status(400).json({
            message: "Batch is required"
        });


    if (!deadline)
        return res.status(400).json({
            message: "Deadline is required"
        });


    if (!jobDescription)
        return res.status(400).json({
            message: "Job Description is required"
        });


    if (jobDescription.length < 10)
        return res.status(400).json({
            message: "Job Description must contain minimum 10 characters"
        });


    if (!hiringProcess)
        return res.status(400).json({
            message: "Hiring Process is required"
        });


    next();
};

const validateUpdateJobPosting = (req, res, next) => {
    console.log("UPDATE VALIDATOR BODY:", req.body);
    const {
        role,
        department,
        location,
        package: pkg,
        cgpa_limit,
        batch,
        application_deadline,
        job_description,
        hiring_process
    } = req.body;


    if (!role)
        return res.status(400).json({
            message:"Job role is required"
        });


    if (!department)
        return res.status(400).json({
            message:"Department is required"
        });


    if (!location)
        return res.status(400).json({
            message:"Location is required"
        });


    if (!pkg)
        return res.status(400).json({
            message:"Package is required"
        });


    if (cgpa_limit === undefined)
        return res.status(400).json({
            message:"CGPA is required"
        });


    if (!batch)
        return res.status(400).json({
            message:"Batch is required"
        });


    if (!application_deadline)
        return res.status(400).json({
            message:"Deadline is required"
        });


    if (!job_description)
        return res.status(400).json({
            message:"Job Description is required"
        });


    if (!hiring_process)
        return res.status(400).json({
            message:"Hiring Process is required"
        });


    next();
};
/* ===========================
   Eligibility Validators
=========================== */

const validateEligibility = (req, res, next) => {

    const {
        job_id,
        qualification,
        min_percentage,
        max_backlogs,
        allowed_batch_year,
        gender_preference,
    } = req.body;

    if (!job_id || isNaN(job_id)) {
        return res.status(400).json({
            message: "Valid Job ID is required",
        });
    }

    if (!qualification || qualification.trim() === "") {
        return res.status(400).json({
            message: "Qualification is required",
        });
    }

    if (
        min_percentage === undefined ||
        isNaN(min_percentage)
    ) {
        return res.status(400).json({
            message: "Valid minimum percentage is required",
        });
    }

    if (min_percentage < 0 || min_percentage > 100) {
        return res.status(400).json({
            message: "Percentage must be between 0 and 100",
        });
    }

    if (
        max_backlogs !== undefined &&
        isNaN(max_backlogs)
    ) {
        return res.status(400).json({
            message: "Maximum backlogs must be numeric",
        });
    }

    if (
        allowed_batch_year &&
        isNaN(allowed_batch_year)
    ) {
        return res.status(400).json({
            message: "Invalid batch year",
        });
    }

    if (
        gender_preference &&
        !["Male", "Female", "Any"].includes(gender_preference)
    ) {
        return res.status(400).json({
            message: "Invalid gender preference",
        });
    }

    next();
};

export {
    validateRequestBody,
    sanitizeInput,

    validateJobId,
    validateCreateJob,

    validateJobPosting,
    validateUpdateJobPosting,

    validateEligibility,
};