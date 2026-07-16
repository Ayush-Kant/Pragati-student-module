import Joi from "joi";
import { sanitizeInput } from "../utils/sanitize.js";

export { sanitizeInput };

export const validateParticipant = Joi.object({
  studentId: Joi.number().integer().optional()
});

export const validateParticipantParams = Joi.object({
  id: Joi.number().integer().positive().required()
});

export const validateDeleteParticipantParams = Joi.object({
  id: Joi.number().integer().positive().required(),
  studentId: Joi.number().integer().positive().required()
});