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

export const validateAttendance = Joi.object({
  studentId: Joi.number().integer().optional(),
  status: Joi.string().valid("Present", "Absent", "Late", "Excused").required()
});

export const validateAttendanceParams = Joi.object({
  id: Joi.number().integer().positive().required()
});

export const validateAttendanceQuery = Joi.object({
  sessionId: Joi.number().integer().positive().required()
}).unknown(false);
