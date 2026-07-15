import Joi from "joi";

export const validateDeadline = (data) => {
  const schema = Joi.object({
    dueDate: Joi.date().iso().required(),
    reminderDate: Joi.date().iso().allow(null),
  });

  return schema.validate(data, { abortEarly: false });
};
