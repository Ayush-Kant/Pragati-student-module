import Joi from "joi";

export const validateCourse = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.alternatives().try(Joi.number().integer().positive(), Joi.string().trim().required()),
    });

    const { error } = schema.validate(req.params);
    if (error) {
        return res.status(400).json({ success: false, message: "Invalid course id" });
    }

    next();
};

export const validateTrainingList = (req, res, next) => {
    const schema = Joi.object({
        lessonId: Joi.alternatives().try(Joi.number().integer().positive(), Joi.string().trim()),
    });

    const { error } = schema.validate(req.query);
    if (error) {
        return res.status(400).json({ success: false, message: "Invalid query parameters" });
    }

    next();
};