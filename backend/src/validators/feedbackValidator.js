import Joi from "joi";

export const validateFeedback = (data) => {
  const schema = Joi.object({
    remarks: Joi.string().trim().min(3).max(1000).required(),
    grade: Joi.string().trim().min(1).max(10).required(),
    studentId: Joi.number().integer().positive().required(),
    submissionId: Joi.number().integer().positive().allow(null).optional(),
  });

  return schema.validate(data, { abortEarly: false });
};
