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

    const {
        company_id,
        title,
        job_type,
        location,
        salary_min,
        salary_max,
        experience_required
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

    if (!job_type || job_type.trim() === "") {
        return res.status(400).json({
            message: "Job type is required",
        });
    }

    if (!location || location.trim() === "") {
        return res.status(400).json({
            message: "Location is required",
        });
    }

    if (salary_min === undefined || isNaN(salary_min)) {
        return res.status(400).json({
            message: "Valid minimum salary is required",
        });
    }

    if (salary_max === undefined || isNaN(salary_max)) {
        return res.status(400).json({
            message: "Valid maximum salary is required",
        });
    }

    if (experience_required === undefined || isNaN(experience_required)) {
        return res.status(400).json({
            message: "Valid experience is required",
        });
    }

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

    validateEligibility,
};