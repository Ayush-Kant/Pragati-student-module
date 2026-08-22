import { test } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { Quiz, QuizQuestion, QuizOption, QuizAttempt, QuizAnswer } from '../src/models/quizModel.js';
import { calculateScore, buildPerformanceSummary } from '../src/utils/quizScoring.js';
import { validateQuizSubmission, validateQuizId } from '../validations/quizValidation.js';

const sampleQuiz = {
  title: 'Sample Quiz',
  description: 'Description',
  durationMinutes: 15,
  passingScore: 50,
  isActive: true,
};

const sampleQuestions = [
  { questionText: 'Q1', correctOptionId: 1, displayOrder: 1 },
  { questionText: 'Q2', correctOptionId: 3, displayOrder: 2 },
];

const sampleOptions = [
  { optionText: 'A', isCorrect: true, displayOrder: 1 },
  { optionText: 'B', isCorrect: false, displayOrder: 2 },
  { optionText: 'C', isCorrect: true, displayOrder: 3 },
  { optionText: 'D', isCorrect: false, displayOrder: 4 },
];

test('validateQuizId rejects invalid quiz ids', () => {
  const { error } = validateQuizId('abc');
  assert.ok(error);
});

test('validateQuizSubmission rejects payloads with invalid answers', () => {
  const { error } = validateQuizSubmission({ answers: [{ questionId: 'one', selectedOptionId: 'two' }] });
  assert.ok(error);
});

test('calculateScore returns accurate values', () => {
  const questions = [
    { id: 1, correctOptionId: 2 },
    { id: 2, correctOptionId: 4 },
  ];
  const result = calculateScore(questions, [{ questionId: 1, selectedOptionId: 2 }, { questionId: 2, selectedOptionId: 3 }]);
  assert.equal(result.score, 1);
  assert.equal(result.percentage, 50);
});

test('buildPerformanceSummary returns detailed metrics', () => {
  const summary = buildPerformanceSummary([
    { score: 10, percentage: 50 },
    { score: 20, percentage: 80 },
  ]);
  assert.equal(summary.totalAttempts, 2);
  assert.equal(summary.highestScore, 20);
  assert.equal(summary.lowestScore, 10);
  assert.equal(summary.passCount, 1);
  assert.equal(summary.failCount, 1);
  assert.equal(summary.passRate, 50);
});
