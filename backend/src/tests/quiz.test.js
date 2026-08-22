import { describe, it, expect, beforeEach, jest } from '@jest/globals';

jest.unstable_mockModule('../models/quizModel.js', () => ({
  Quiz: { findOne: jest.fn(), findAll: jest.fn() },
  QuizQuestion: { findAll: jest.fn(), count: jest.fn(), findOne: jest.fn() },
  QuizOption: { findAll: jest.fn(), findOne: jest.fn() },
  QuizAttempt: { findOne: jest.fn(), create: jest.fn(), findAll: jest.fn() },
  QuizAnswer: { findOne: jest.fn(), create: jest.fn(), bulkCreate: jest.fn(), findAll: jest.fn() },
}));

jest.unstable_mockModule('../config/sequelize.js', () => ({
  __esModule: true,
  default: {
    define: jest.fn(() => ({
      findOne: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
      save: jest.fn(),
      destroy: jest.fn(),
      update: jest.fn(),
    })),
    transaction: jest.fn(),
    sync: jest.fn(),
  },
  sequelize: {
    transaction: jest.fn(),
    define: jest.fn(() => ({
      findOne: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
      save: jest.fn(),
      destroy: jest.fn(),
      update: jest.fn(),
    })),
    sync: jest.fn(),
  },
}));

jest.unstable_mockModule('../models/quizAttemptModel.js', () => ({
  QuizAttempt: {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    save: jest.fn(),
  },
}));

const { Quiz, QuizAttempt } = await import('../models/quizModel.js');
const { sequelize } = await import('../config/sequelize.js');
const { QuizAttempt: QuizAttemptModel } = await import('../models/quizAttemptModel.js');
const quizService = await import('../services/quizService.js');
const quizResultService = await import('../services/quizResultService.js');
const quizAttemptMiddleware = (await import('../middleware/quizAttemptMiddleware.js')).default;
const { evaluateAnswers, sanitizeQuizOption } = await import('../utils/quizHelpers.js');

describe('quiz review coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'test';
  });

  it('reuses quiz scoring helpers and option sanitization utilities', () => {
    const result = evaluateAnswers(
      [
        { id: 1, correctOptionId: 10 },
        { id: 2, correctOptionId: 20 },
      ],
      [
        { questionId: 1, selectedOptionId: 10 },
        { questionId: 2, selectedOptionId: 99 },
      ],
    );

    expect(result.correctAnswers).toBe(1);
    expect(result.incorrectAnswers).toBe(1);
    expect(sanitizeQuizOption({ id: 4, optionText: 'A', displayOrder: 1, isCorrect: true })).toEqual({
      id: 4,
      optionText: 'A',
      displayOrder: 1,
    });
  });

  it('getQuizDetails returns only safe option fields and excludes isCorrect', async () => {
    Quiz.findOne.mockImplementation(async (options) => {
      expect(options.include[0].attributes).toEqual(['id', 'questionText', 'displayOrder']);
      expect(options.include[0].include[0].attributes).toEqual(['id', 'optionText', 'displayOrder']);

      return {
        toJSON: () => ({
          id: 1,
          title: 'Sample Quiz',
          questions: [
            {
              id: 10,
              questionText: 'Which one?',
              options: [{ id: 21, optionText: 'Alpha', displayOrder: 1 }],
            },
          ],
        }),
      };
    });

    const result = await quizService.getQuizDetails(1);

    expect(result.questions[0].options[0]).toEqual({
      id: 21,
      optionText: 'Alpha',
      displayOrder: 1,
    });
    expect(result.questions[0].options[0].isCorrect).toBeUndefined();
  });

  it('submitted attempts can retrieve their result, but in-progress attempts cannot', async () => {
    const submittedReq = {
      params: { attemptId: 7 },
      originalUrl: '/api/student/quizzes/attempts/7/result',
      path: '/quizzes/attempts/7/result',
      user: { id: 2 },
    };
    const submittedRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    process.env.NODE_ENV = 'production';
    QuizAttemptModel.findOne.mockResolvedValue({ id: 7, studentId: 2, status: 'submitted' });
    await quizAttemptMiddleware(submittedReq, submittedRes, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(submittedReq.quizAttempt.status).toBe('submitted');

    const blockedReq = {
      params: { attemptId: 8 },
      originalUrl: '/api/student/quizzes/attempts/8/result',
      path: '/quizzes/attempts/8/result',
      user: { id: 2 },
    };
    const blockedRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const blockedNext = jest.fn();
    QuizAttemptModel.findOne.mockResolvedValue({ id: 8, studentId: 2, status: 'in_progress' });
    await quizAttemptMiddleware(blockedReq, blockedRes, blockedNext);
    expect(blockedRes.status).toHaveBeenCalledWith(409);
    expect(blockedNext).not.toHaveBeenCalled();
  });

  it('unauthorized users cannot retrieve another users result', async () => {
    QuizAttempt.findOne.mockResolvedValue({
      id: 12,
      studentId: 99,
      quiz: { title: 'Other quiz', passingScore: 60 },
      answers: [],
      toJSON: () => ({ id: 12, studentId: 99, quiz: { title: 'Other quiz', passingScore: 60 }, answers: [] }),
    });

    await expect(quizResultService.getAttemptResult(12, 2)).rejects.toMatchObject({ status: 403 });
  });

  it('save and submit operations remain blocked after submission', async () => {
    const submittedAttempt = { id: 22, studentId: 2, status: 'submitted' };
    QuizAttempt.findOne.mockResolvedValue(submittedAttempt);

    await expect(quizService.saveQuizAnswer(22, 2, 5, 11)).rejects.toMatchObject({ status: 409 });

    sequelize.transaction.mockResolvedValue({ commit: jest.fn(), rollback: jest.fn() });
    QuizAttempt.findOne.mockResolvedValue({ id: 23, studentId: 2, status: 'submitted', save: jest.fn() });

    await expect(quizService.submitQuizAttempt(23, 2)).rejects.toMatchObject({ status: 409 });
  });
});
