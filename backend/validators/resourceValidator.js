import Joi from "joi";

export const validateResource = Joi.object({
    id: Joi.number().integer().positive().required(),
});

export const validateLessonId = Joi.object({
    lessonId: Joi.number().integer().positive().optional(),
}).unknown(false);