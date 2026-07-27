import Joi from "joi";

export const validateProgress = Joi.object({
    courseId: Joi.number().integer().positive().required(),
    progress: Joi.number().min(0).max(100).required(),
});
