import {
  validateQuizId,
  validateAttemptId,
  validateAnswerPayload,
  validateQuizSubmission,
} from '../../validations/quizValidation.js';

test('validateQuizId rejects invalid ids', () => {
  const res = validateQuizId('abc');
  expect(res.error).toBeDefined();
});

test('validateAttemptId accepts numeric ids', () => {
  const res = validateAttemptId(12);
  expect(res.error).toBeUndefined();
});

test('validateAnswerPayload requires questionId', () => {
  const res = validateAnswerPayload({});
  expect(res.error).toBeDefined();
});

test('validateQuizSubmission requires answers array', () => {
  const res = validateQuizSubmission({});
  expect(res.error).toBeDefined();
});
