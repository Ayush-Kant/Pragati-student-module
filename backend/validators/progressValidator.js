import Joi from "joi";

export const validateProgress = (req, res, next) => {
    const schema = Joi.object({
        courseId: Joi.alternatives().try(Joi.number().integer().positive(), Joi.string().trim().required()),
        progress: Joi.number().min(0).max(100).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: "courseId and progress are required" });
    }

    next();
};

export const sanitizeInput = (req, res, next) => {
    next();
};