import Joi from "joi";

const VALID_TYPES = ['info', 'success', 'warning', 'alert'];

export const validateSendNotification = (data) => {
  const schema = Joi.object({
    userIds: Joi.array().items(Joi.number().integer().positive()).min(1).required(),
    title: Joi.string().max(255).required(),
    message: Joi.string().required(),
    type: Joi.string().valid(...VALID_TYPES).default('info'),
    linkUrl: Joi.string().uri({ allowRelative: true }).max(255).optional().allow(null, ''),
    sendEmail: Joi.boolean().default(false)
  });

  return schema.validate(data);
};

export const validateMarkAsRead = (data) => {
  const schema = Joi.object({
    notificationIds: Joi.array().items(Joi.number().integer().positive()).optional(),
    markAll: Joi.boolean().optional()
  }).or('notificationIds', 'markAll');

  return schema.validate(data);
};

export const validateGetQuery = (data) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20)
  });

  return schema.validate(data);
};
