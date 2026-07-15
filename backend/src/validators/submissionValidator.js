import Joi from "joi";

export const validateSubmission = (data) => {
  const schema = Joi.object({
    fileUrl: Joi.string().uri().allow(""),
    content: Joi.string().allow(""),
    status: Joi.string().valid("Submitted", "Draft", "Late"),
  }).min(1);

  return schema.validate(data, { abortEarly: false });
};
