import Joi from "joi";

export const updateCompanyValidation = Joi.object({
  name: Joi.string().min(2).max(255),

  website: Joi.string().uri(),

  industry: Joi.string(),

  size: Joi.string(),

  description: Joi.string(),

  logo_url: Joi.string().uri(),
});

export const createTeamMemberValidation = Joi.object({
  full_name: Joi.string().min(2).required(),

  email: Joi.string().email().required(),

  role: Joi.string().valid("admin", "recruiter", "viewer").required(),
});

export const updateTeamMemberValidation = Joi.object({
  role: Joi.string().valid("admin", "recruiter", "viewer"),

  is_active: Joi.boolean(),
});
