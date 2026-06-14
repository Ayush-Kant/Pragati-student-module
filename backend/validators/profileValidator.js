// profileValidator.js

export const validateResume = (req, res, next) => {
    const { filename, url } = req.body;

    if (!filename || filename.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Resume filename is required",
        });
    }

    if (!url || url.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Resume URL is required",
        });
    }

    next();
};

export const validatePortfolio = (req, res, next) => {
    const { headline, bio, github, linkedin } = req.body;

    if (!headline || headline.trim().length < 3) {
        return res.status(400).json({
            success: false,
            message: "Headline must contain at least 3 characters",
        });
    }

    if (!bio || bio.trim().length < 5) {
        return res.status(400).json({
            success: false,
            message: "Bio must contain at least 5 characters",
        });
    }

    next();
};

export const validateProject = (req, res, next) => {
    const { title, description } = req.body;

    if (!title || title.trim().length < 3) {
        return res.status(400).json({
            success: false,
            message: "Project title must contain at least 3 characters",
        });
    }

    if (!description || description.trim().length < 5) {
        return res.status(400).json({
            success: false,
            message: "Project description must contain at least 5 characters",
        });
    }

    next();
};

export const validateSkill = (req, res, next) => {
    const { skill } = req.body;

    if (!skill || skill.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Skill is required",
        });
    }

    next();
};

export const validateSocialLinks = (req, res, next) => {
    const { github, linkedin } = req.body;

    if (github && !github.startsWith("http")) {
        return res.status(400).json({
            success: false,
            message: "Invalid GitHub URL",
        });
    }

    if (linkedin && !linkedin.startsWith("http")) {
        return res.status(400).json({
            success: false,
            message: "Invalid LinkedIn URL",
        });
    }

    next();
};

export const validateRequestBody = (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            success: false,
            message: "Request body cannot be empty",
        });
    }

    next();
};

export const sanitizeInput = (req, res, next) => {
    for (const key in req.body) {
        if (typeof req.body[key] === "string") {
            req.body[key] = req.body[key].trim();
        }
    }

    next();
};