import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Mock models and sequelize
jest.unstable_mockModule('../../models/quizModel.js', () => ({
  Quiz: {
    findOne: jest.fn(),
    findAll: jest.fn(),
  },
  QuizQuestion: {
    findAll: jest.fn(),
    count: jest.fn(),
    findOne: jest.fn(),
  },
  QuizOption: {
    findAll: jest.fn(),
    findOne: jest.fn(),
  },
  QuizAttempt: {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    save: jest.fn(),
  },
  QuizAnswer: {
    findOne: jest.fn(),
    create: jest.fn(),
    bulkCreate: jest.fn(),
    findAll: jest.fn(),
  },
}));

jest.unstable_mockModule('../../config/sequelize.js', () => ({
  sequelize: {
    transaction: jest.fn(),
  },
  default: { sequelize: {} },
}));

const { Quiz, QuizQuestion, QuizOption, QuizAttempt, QuizAnswer } = await import('../../models/quizModel.js');
const { sequelize } = await import('../../config/sequelize.js');
const quizService = await import('../../services/quizService.js');

describe('quizService (unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('startQuizAttempt creates a new attempt when none exists', async () => {
    Quiz.findOne.mockResolvedValue({ id: 1, title: 'Sample Quiz' });
    QuizQuestion.count.mockResolvedValue(3);
    QuizAttempt.findOne.mockResolvedValue(null);
    QuizAttempt.create.mockResolvedValue({ id: 10, quizId: 1, studentId: 5, status: 'in_progress', toJSON() { return { id: 10, quizId: 1, studentId: 5, status: 'in_progress' }; } });

    const attempt = await quizService.startQuizAttempt(1, 5);
    expect(Quiz.findOne).toHaveBeenCalled();
    expect(QuizQuestion.count).toHaveBeenCalledWith({ where: { quizId: 1 } });
    expect(QuizAttempt.create).toHaveBeenCalled();
    expect(attempt.id).toBeDefined();
  });

  it('startQuizAttempt returns existing in_progress attempt', async () => {
    const existing = { id: 11, quizId: 1, studentId: 5, status: 'in_progress', toJSON() { return { id: 11, quizId: 1, studentId: 5, status: 'in_progress' }; } };
    Quiz.findOne.mockResolvedValue({ id: 1 });
    QuizAttempt.findOne.mockResolvedValue(existing);

    const attempt = await quizService.startQuizAttempt(1, 5);
    expect(QuizAttempt.findOne).toHaveBeenCalled();
    expect(attempt.id).toBe(11);
  });

  it('saveQuizAnswer validates question and option ownership and creates answer', async () => {
    const attempt = { id: 20, quizId: 2, studentId: 7, status: 'in_progress' };
    QuizAttempt.findOne.mockResolvedValue(attempt);
    QuizQuestion.findOne.mockResolvedValue({ id: 100, quizId: 2, correctOptionId: 501 });
    QuizOption.findOne.mockResolvedValue({ id: 501 });
    QuizAnswer.findOne.mockResolvedValue(null);
    QuizAnswer.create.mockResolvedValue({ id: 300, quizAttemptId: 20, questionId: 100, selectedOptionId: 501, isCorrect: true });

    QuizAnswer.create.mockResolvedValue({ id: 300, quizAttemptId: 20, questionId: 100, selectedOptionId: 501, isCorrect: true, toJSON() { return { id: 300, quizAttemptId: 20, questionId: 100, selectedOptionId: 501, isCorrect: true }; } });
    const created = await quizService.saveQuizAnswer(20, 7, 100, 501);
    expect(QuizAnswer.create).toHaveBeenCalled();
    expect(created.selectedOptionId).toBe(501);
  });

  it('saveQuizAnswer removes answer when selectedOptionId is null', async () => {
    const attempt = { id: 21, quizId: 2, studentId: 7, status: 'in_progress' };
    const existing = { id: 301, destroy: jest.fn() };
    QuizAttempt.findOne.mockResolvedValue(attempt);
    QuizQuestion.findOne.mockResolvedValue({ id: 101, quizId: 2, correctOptionId: 502 });
    QuizAnswer.findOne.mockResolvedValue(existing);

    const res = await quizService.saveQuizAnswer(21, 7, 101, null);
    expect(existing.destroy).toHaveBeenCalled();
    expect(res.success).toBe(true);
  });

  it('submitQuizAttempt uses transaction and commits on success', async () => {
    const transactionMock = { commit: jest.fn(), rollback: jest.fn() };
    sequelize.transaction.mockResolvedValue(transactionMock);

    const attemptRecord = { id: 50, quizId: 3, studentId: 9, status: 'in_progress', save: jest.fn() };
    QuizAttempt.findOne.mockResolvedValue(attemptRecord);

    const questions = [ { id: 10, correctOptionId: 100 }, { id: 11, correctOptionId: 110 } ];
    QuizQuestion.findAll.mockResolvedValue(questions.map(q => ({ toJSON() { return q; } })));

    const answers = [ { id: 400, questionId: 10, selectedOptionId: 100, save: jest.fn(), toJSON() { return { id: 400, questionId: 10, selectedOptionId: 100 }; } } ];
    QuizAnswer.findAll.mockResolvedValue(answers);

    Quiz.findOne.mockResolvedValue({ passingScore: 50 });

    const result = await quizService.submitQuizAttempt(50, 9);
    expect(sequelize.transaction).toHaveBeenCalled();
    expect(transactionMock.commit).toHaveBeenCalled();
    expect(result.attempt.score).toBeDefined();
  });

  it('submitQuizAttempt rolls back transaction on error', async () => {
    const transactionMock = { commit: jest.fn(), rollback: jest.fn() };
    sequelize.transaction.mockResolvedValue(transactionMock);

    QuizAttempt.findOne.mockResolvedValue(null); // will cause NotFound error

    await expect(quizService.submitQuizAttempt(999, 1)).rejects.toBeDefined();
    expect(transactionMock.rollback).toHaveBeenCalled();
  });
});
