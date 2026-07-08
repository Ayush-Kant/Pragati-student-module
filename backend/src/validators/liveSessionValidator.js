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

export const validateSession = Joi.object({
  title: Joi.string().trim().required(),
  trainer: Joi.string().trim().required(),
  date: Joi.string().trim().required(),
  time: Joi.string().trim().required(),
  duration: Joi.string().trim().required(),
  status: Joi.string().valid("Upcoming", "Scheduled", "Live", "Completed").default("Upcoming"),
  session_type: Joi.string().valid("webinar", "interactive", "qa").default("webinar"),
  mentor_id: Joi.number().integer().optional(),
  scheduled_at: Joi.date().iso().optional()
});

export const validateSessionId = Joi.object({
  id: Joi.number().integer().positive().required()
});
