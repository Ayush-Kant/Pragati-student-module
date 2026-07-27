import Joi from "joi";

export const validateLesson = Joi.object({
    id: Joi.number().integer().positive().required(),
});

export const validateLessonProgress = Joi.object({
    completed: Joi.boolean().required(),
});
