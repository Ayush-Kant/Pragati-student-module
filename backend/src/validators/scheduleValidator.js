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

export const validateSchedule = Joi.object({
  title: Joi.string().required(),
  trainer: Joi.string().required(),
  date: Joi.string().required(),
  time: Joi.string().required(),
  duration: Joi.string().required(),
  status: Joi.string().valid("Scheduled", "Upcoming", "Live", "Completed").default("Scheduled"),
  session_id: Joi.number().integer().optional()
});
