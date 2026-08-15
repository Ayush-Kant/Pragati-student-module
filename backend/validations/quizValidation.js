import Joi from 'joi';

const answerSchema = Joi.object({
  questionId: Joi.number().integer().positive().required(),
  selectedOptionId: Joi.number().integer().positive().allow(null),
});

export const quizSubmissionSchema = Joi.object({
  answers: Joi.array().items(answerSchema).min(1).required(),
});

export const validateQuizSubmission = (payload) => quizSubmissionSchema.validate(payload, { abortEarly: false });

export const validateQuizId = (quizId) => {
  const schema = Joi.number().integer().positive().required();
  return schema.validate(quizId);
};

export const validateAttemptId = (attemptId) => {
  const schema = Joi.number().integer().positive().required();
  return schema.validate(attemptId);
};

export const validateQuestionId = (questionId) => {
  const schema = Joi.number().integer().positive().required();
  return schema.validate(questionId);
};

export const validateOptionId = (optionId) => {
  const schema = Joi.number().integer().positive().allow(null);
  return schema.validate(optionId);
};

export const validateAnswerPayload = (payload) => {
  const schema = Joi.object({
    questionId: Joi.number().integer().positive().required(),
    selectedOptionId: Joi.number().integer().positive().allow(null),
  });

  return schema.validate(payload, { abortEarly: false });
};
