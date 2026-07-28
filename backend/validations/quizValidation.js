import Joi from 'joi';

const answerSchema = Joi.object({
  questionId: Joi.number().integer().positive().required(),
  selectedOptionId: Joi.number().integer().positive().required(),
});

export const quizSubmissionSchema = Joi.object({
  answers: Joi.array().items(answerSchema).min(1).required(),
});

export const validateQuizSubmission = (payload) => quizSubmissionSchema.validate(payload, { abortEarly: false });

export const validateQuizId = (quizId) => {
  const schema = Joi.number().integer().positive().required();
  return schema.validate(quizId);
};
