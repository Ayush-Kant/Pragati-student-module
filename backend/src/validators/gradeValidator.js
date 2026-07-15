import Joi from "joi";

export const validateGrade = (data) => {
  const schema = Joi.object({
    studentId: Joi.number().integer().positive().required(),
    marks: Joi.number().integer().min(0).max(1000).required(),
    grade: Joi.string().trim().min(1).max(10).required(),
  });

  return schema.validate(data, { abortEarly: false });
};
