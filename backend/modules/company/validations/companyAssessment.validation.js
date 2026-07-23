import Joi from "joi";

export const createAssessmentValidation = Joi.object({
  title: Joi.string().min(2).max(255).required(),

  type: Joi.string()
    .valid("mcq", "coding")
    .required(),

  difficulty: Joi.string()
    .valid("easy", "medium", "hard")
    .default("medium"),

  time_limit_minutes: Joi.number()
    .integer()
    .min(1)
    .required(),

  total_marks: Joi.number()
    .integer()
    .min(1)
    .required(),
});

export const updateAssessmentValidation = Joi.object({
  title: Joi.string().min(2).max(255),

  type: Joi.string()
    .valid("mcq", "coding"),

  difficulty: Joi.string()
    .valid("easy", "medium", "hard"),

  time_limit_minutes: Joi.number()
    .integer()
    .min(1),

  total_marks: Joi.number()
    .integer()
    .min(1),
});

export const assignAssessmentValidation = Joi.object({
  driveId: Joi.number()
    .integer()
    .required(),
});