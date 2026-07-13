import Joi from "joi";

export const validateLesson = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.alternatives().try(Joi.number().integer().positive(), Joi.string().trim().required()),
    });

    const { error } = schema.validate(req.params);
    if (error) {
        return res.status(400).json({ success: false, message: "Invalid lesson id" });
    }

    next();
};

export const validateLessonProgress = (req, res, next) => {
    const schema = Joi.object({
        completed: Joi.boolean().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: "completed is required and must be a boolean" });
    }

    next();
};