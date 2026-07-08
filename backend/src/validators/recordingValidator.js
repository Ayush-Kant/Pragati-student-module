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

export const validateRecording = Joi.object({
  title: Joi.string().trim().required(),
  duration: Joi.string().trim().required(),
  recordingUrl: Joi.string().trim().required()
});

export const validateRecordingId = Joi.object({
  id: Joi.number().integer().positive().required()
});
