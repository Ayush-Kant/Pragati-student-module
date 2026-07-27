import test from 'node:test';
import assert from 'node:assert/strict';

import { calculateScore, buildPerformanceSummary } from '../utils/quizHelpers.js';
import { validateQuizSubmission } from '../validations/quizValidation.js';

test('calculateScore returns the correct score and percentage', () => {
  const questions = [
    { id: 1, correctOptionId: 2 },
    { id: 2, correctOptionId: 4 },
  ];

  const submittedAnswers = [
    { questionId: 1, selectedOptionId: 2 },
    { questionId: 2, selectedOptionId: 3 },
  ];

  const result = calculateScore(questions, submittedAnswers);

  assert.equal(result.score, 1);
  assert.equal(result.totalQuestions, 2);
  assert.equal(result.percentage, 50);
});

test('buildPerformanceSummary aggregates attempt history correctly', () => {
  const summary = buildPerformanceSummary([
    { score: 10, totalQuestions: 20, percentage: 50 },
    { score: 15, totalQuestions: 20, percentage: 75 },
    { score: 18, totalQuestions: 20, percentage: 90 },
  ]);

  assert.deepEqual(summary, {
    totalAttempts: 3,
    averageScore: 14.33,
    highestScore: 18,
    lowestScore: 10,
    averagePercentage: 71.67,
    passCount: 2,
    passedCount: 2,
    failCount: 1,
    failedCount: 1,
    passRate: 66.67,
    failRate: 33.33,
  });
});

test('validateQuizSubmission rejects invalid payloads', () => {
  const result = validateQuizSubmission({ answers: [{ questionId: 'one' }] });

  assert.ok(result.error);
  assert.match(result.error.message, /questionId/);
});
