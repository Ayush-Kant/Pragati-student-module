import Joi from "joi";
import { sanitizeInput } from "../utils/sanitize.js";

export { sanitizeInput };

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
