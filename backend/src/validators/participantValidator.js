import Joi from "joi";

export const sanitizeInput = (data) => {
  if (!data || typeof data !== "object") return data;

  const sanitized = {};

  for (const key in data) {
    if (typeof data[key] === "string") {
      sanitized[key] = data[key].trim();
    } else {
      sanitized[key] = data[key];
    }
  }

  return sanitized;
};

export const validateParticipant = Joi.object({
  studentId: Joi.number().integer().optional()
});

export const validateParticipantParams = Joi.object({
  id: Joi.number().integer().positive().required()
});

export const validateDeleteParticipantParams = Joi.object({
  id: Joi.number().integer().positive().required(),
  participantId: Joi.number().integer().positive().required()
});