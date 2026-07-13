import Joi from "joi";
import { sanitizeInput } from "../utils/sanitize.js";

export { sanitizeInput };

export const validateSessionId = Joi.object({
  id: Joi.number().integer().positive().required()
});
