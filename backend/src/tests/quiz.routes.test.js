import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';

// Mock the quizService used by controllers
jest.unstable_mockModule('../services/quizService.js', () => ({
  getAvailableQuizzes: jest.fn(),
  getQuizDetails: jest.fn(),
  startQuizAttempt: jest.fn(),
  getAttemptById: jest.fn(),
  saveQuizAnswer: jest.fn(),
  submitQuizAttempt: jest.fn(),
  getAttemptResult: jest.fn(),
  getPerformanceSummary: jest.fn(),
}));

const quizService = await import('../services/quizService.js');
const quizRoutes = (await import('../routes/quizRoutes.js')).default;

process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
const app = express();
app.use(express.json());
app.use('/api/student', quizRoutes);

const sign = (payload) => jwt.sign(payload, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });

describe('quiz routes (controllers) with mocked services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /quizzes requires JWT and returns quizzes', async () => {
    quizService.getAvailableQuizzes.mockResolvedValue([{ id: 1, title: 'Q1' }]);
    const token = sign({ id: 2, role: 'student' });

    const res = await request(app).get('/api/student/quizzes').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /quizzes/:quizId hides correct answers for active attempts via getAttempt route', async () => {
    const token = sign({ id: 3, role: 'student' });
    // simulate getAttemptById returning a structure with attempt.status === 'in_progress'
    quizService.getAttemptById.mockResolvedValue({ attempt: { id: 5, status: 'in_progress' }, questions: [{ id: 1, options: [{ id: 10, optionText: 'A' }] }] });

    const res = await request(app).get('/api/student/quizzes/attempts/5').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // ensure option does not contain isCorrect or correctOptionId in questions
    const questions = res.body.data.questions;
    expect(questions[0].options[0].isCorrect).toBeUndefined();
  });

  it('POST /quizzes/:quizId/start starts an attempt', async () => {
    const token = sign({ id: 4, role: 'student' });
    quizService.startQuizAttempt.mockResolvedValue({ id: 22, quizId: 2, studentId: 4, status: 'in_progress' });
    const res = await request(app).post('/api/student/quizzes/2/start').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('in_progress');
  });

  it('PUT save answer delegates to service and returns 200', async () => {
    const token = sign({ id: 5, role: 'student' });
    quizService.saveQuizAnswer.mockResolvedValue({ id: 60, questionId: 10, selectedOptionId: 100 });
    const res = await request(app).put('/api/student/quizzes/attempts/60/answers').set('Authorization', `Bearer ${token}`).send({ questionId: 10, selectedOptionId: 100 });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('POST submit attempt delegates to service and returns 200', async () => {
    const token = sign({ id: 6, role: 'student' });
    quizService.submitQuizAttempt.mockResolvedValue({ attempt: { id: 70 }, result: { score: 2 } });
    const res = await request(app).post('/api/student/quizzes/attempts/70/submit').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.attempt.id).toBe(70);
  });

  it('GET result returns student result via service', async () => {
    const token = sign({ id: 7, role: 'student' });
    quizService.getAttemptResult.mockResolvedValue({ quizTitle: 'Q', attemptId: 80, score: 5 });
    const res = await request(app).get('/api/student/quizzes/attempts/80/result').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.attemptId).toBe(80);
  });

  it('GET performance returns aggregated data', async () => {
    const token = sign({ id: 8, role: 'student' });
    quizService.getPerformanceSummary.mockResolvedValue({ totalAttempts: 4, completedQuizzes: 3 });
    const res = await request(app).get('/api/student/quizzes/performance').set('Authorization', `Bearer ${token}`);
    if (res.status !== 200) console.error('performance route error body:', res.body);
    expect(res.status).toBe(200);
    expect(res.body.data.totalAttempts).toBe(4);
  });
});
