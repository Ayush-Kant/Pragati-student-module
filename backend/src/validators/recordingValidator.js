import Joi from "joi";
import { sanitizeInput } from "../utils/sanitize.js";

export { sanitizeInput };

export const validateRecordingId = Joi.object({
  id: Joi.number().integer().positive().required()
});
