import { calculateScore, evaluateAnswers } from '../utils/quizScoring.js';

test('calculateScore counts correct answers and percentage', () => {
  const questions = [
    { id: 1, correctOptionId: 11 },
    { id: 2, correctOptionId: 22 },
    { id: 3, correctOptionId: 33 },
  ];

  const submitted = [
    { questionId: 1, selectedOptionId: 11 },
    { questionId: 2, selectedOptionId: 20 },
  ];

  const result = calculateScore(questions, submitted);
  expect(result.score).toBe(1);
  expect(result.totalQuestions).toBe(3);
  expect(typeof result.percentage).toBe('number');
});

test('evaluateAnswers returns detailed breakdown', () => {
  const questions = [
    { id: 1, correctOptionId: 11 },
    { id: 2, correctOptionId: 22 },
    { id: 3, correctOptionId: 33 },
    { id: 4, correctOptionId: 44 },
  ];

  const storedAnswers = [
    { questionId: 1, selectedOptionId: 11 },
    { questionId: 2, selectedOptionId: 20 },
    { questionId: 4, selectedOptionId: 44 },
  ];

  const evalRes = evaluateAnswers(questions, storedAnswers);
  expect(evalRes.totalQuestions).toBe(4);
  expect(evalRes.correctAnswers).toBe(2);
  expect(evalRes.incorrectAnswers).toBe(1);
  expect(evalRes.unanswered).toBe(1);
  expect(evalRes.score).toBe(2);
  expect(evalRes.percentage).toBeGreaterThanOrEqual(0);
  expect(evalRes.percentage).toBeLessThanOrEqual(100);
});
