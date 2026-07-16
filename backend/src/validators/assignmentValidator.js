import Joi from "joi";

export const validateAssignment = (data) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(200),
    subject: Joi.string().trim().min(2).max(100),
    description: Joi.string().trim().max(2000),
    dueDate: Joi.date().iso(),
    totalMarks: Joi.number().integer().min(0).max(1000),
    status: Joi.string().valid("Open", "Closed", "Draft", "Submitted"),
  }).min(1);

  return schema.validate(data, { abortEarly: false });
};

export const validateAssignmentParams = (data) => {
  const schema = Joi.object({
    id: Joi.number().integer().positive().required(),
  });

  return schema.validate(data, { abortEarly: false });
};

export const validateAssignmentQuery = (data) => {
  const schema = Joi.object({
    status: Joi.string().valid("Open", "Closed", "Draft", "Submitted"),
    subject: Joi.string().trim().max(100),
  }).unknown(true);

  return schema.validate(data, { abortEarly: false });
};

