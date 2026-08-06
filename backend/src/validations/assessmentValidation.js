import Joi from "joi";
import { HTTP_STATUS, MESSAGES } from "../constants/assessmentConstants.js";
import { errorResponse } from "../utils/assessmentHelpers.js";

const uuid = Joi.string().guid({ version: ["uuidv4"] });

const paramsAssessmentIdSchema = Joi.object({
  assessmentId: uuid.required(),
});

const submitAssessmentSchema = Joi.object({
  attemptId: uuid.required(),
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: uuid.required(),
        selectedOptionIds: Joi.array().items(uuid).min(0).required(),
      })
    )
    .min(1)
    .required(),
});

const historyQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

/**
 * Generic validator factory. `source` is one of "body" | "params" | "query".
 */
const validate = (schema, source = "body") => (req, res, next) => {
  const { error, value } = schema.validate(req[source], {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((d) => d.message);
    return errorResponse(res, HTTP_STATUS.BAD_REQUEST, MESSAGES.VALIDATION_ERROR, errors);
  }

  req[source] = value;
  return next();
};

export const validateAssessmentIdParam = validate(paramsAssessmentIdSchema, "params");
export const validateSubmitAssessment = validate(submitAssessmentSchema, "body");
export const validateHistoryQuery = validate(historyQuerySchema, "query");
