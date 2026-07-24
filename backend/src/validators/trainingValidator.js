import Joi from "joi";

export const validateCourse = Joi.object({
    id: Joi.number().integer().positive().required(),
});

export const validateTrainingList = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    search: Joi.string().trim().allow("").optional(),
    sort: Joi.string().valid("title", "createdAt", "updatedAt", "progress").optional(),
    order: Joi.string().valid("asc", "desc").optional(),
}).unknown(false);
