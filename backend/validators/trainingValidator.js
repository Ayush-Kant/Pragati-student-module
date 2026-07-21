import Joi from "joi";

export const validateCourse = Joi.object({
    id: Joi.number().integer().positive().required(),
});

export const validateTrainingList = Joi.object({}).unknown(false);