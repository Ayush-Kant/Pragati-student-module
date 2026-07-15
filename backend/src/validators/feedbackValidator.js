import Joi from "joi";

export const validateFeedback = (data) => {
  const schema = Joi.object({
    remarks: Joi.string().trim().min(3).max(1000).required(),
    grade: Joi.string().trim().min(1).max(10).required(),
  });

  return schema.validate(data, { abortEarly: false });
};
