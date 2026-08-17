import { evaluateAnswers, calculateScore } from '../utils/quizScoring.js';

describe('quiz evaluation', () => {
  const makeQuestions = (count = 3) => Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    correctOptionId: index + 10,
  }));

  it('scores all correct answers as 100%', () => {
    const questions = makeQuestions(3);
    const answers = questions.map((question) => ({ questionId: question.id, selectedOptionId: question.correctOptionId }));

    const result = evaluateAnswers(questions, answers);

    expect(result.correctAnswers).toBe(3);
    expect(result.incorrectAnswers).toBe(0);
    expect(result.unanswered).toBe(0);
    expect(result.score).toBe(3);
    expect(result.percentage).toBe(100);
  });

  it('scores all wrong answers as zero percent', () => {
    const questions = makeQuestions(3);
    const answers = questions.map((question) => ({ questionId: question.id, selectedOptionId: question.correctOptionId + 100 }));

    const result = evaluateAnswers(questions, answers);

    expect(result.correctAnswers).toBe(0);
    expect(result.incorrectAnswers).toBe(3);
    expect(result.unanswered).toBe(0);
    expect(result.score).toBe(0);
    expect(result.percentage).toBe(0);
  });

  it('handles partial answers correctly', () => {
    const questions = makeQuestions(4);
    const answers = [
      { questionId: 1, selectedOptionId: 10 },
      { questionId: 3, selectedOptionId: 99 },
    ];

    const result = evaluateAnswers(questions, answers);

    expect(result.correctAnswers).toBe(1);
    expect(result.incorrectAnswers).toBe(1);
    expect(result.unanswered).toBe(2);
    expect(result.score).toBe(1);
    expect(result.percentage).toBe(25);
  });

  it('returns zero score for zero questions', () => {
    const result = evaluateAnswers([], []);

    expect(result.totalQuestions).toBe(0);
    expect(result.score).toBe(0);
    expect(result.percentage).toBe(0);
  });

  it('supports custom passing thresholds in score calculation', () => {
    const questions = makeQuestions(4);
    const answers = [
      { questionId: 1, selectedOptionId: 10 },
      { questionId: 2, selectedOptionId: 11 },
      { questionId: 3, selectedOptionId: 99 },
    ];

    const scored = calculateScore(questions, answers);
    expect(scored.score).toBe(2);
    expect(scored.totalQuestions).toBe(4);
    expect(scored.percentage).toBe(50);
    expect(scored.percentage >= 50).toBe(true);
  });
});
