import Joi from "joi";
import { HTTP_STATUS, MESSAGES } from "../constants/assessmentConstants.js";
import { errorResponse } from "../utils/assessmentHelpers.js";

const paramsAssessmentIdSchema = Joi.object({
  assessmentId: Joi.number().integer().positive().required(),
});

const submitAssessmentSchema = Joi.object({
  attemptId: Joi.number().integer().positive().required(),
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: Joi.number().integer().positive().required(),
        selectedOption: Joi.number().integer().min(0).allow(null).required(),
      })
    )
    .min(1)
    .required(),
});

const historyQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

const validate = (schema, source = "body") => (req, res, next) => {
  const { error, value } = schema.validate(req[source], { abortEarly: false, stripUnknown: true });
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