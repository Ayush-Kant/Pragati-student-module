// @ts-nocheck
import { test } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import express from 'express';
import quizRoutes from '../src/routes/quizRoutes.js';

const app = express();
app.use(express.json());
app.use('/api/student', quizRoutes);

const createToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });

const validToken = createToken({ id: 1, uid: 1, userId: 'uuid-test', role: 'student' });
const invalidToken = 'Bearer invalid.jwt.token';

const fakeQuizId = 12345;

// Use the standard strict assert import so editor analyzers recognize assertions.

test('GET /api/student/quizzes returns 401 if JWT is invalid', async () => {
  const res = await request(app)
    .get('/api/student/quizzes')
    .set('Authorization', invalidToken)
    .expect(401);

  assert.equal(res.status, 401);
  assert.strictEqual(typeof res.body, 'object');
  assert.equal(Boolean(res.body && res.body.success === false), true);
  assert.match(String(res.body.message || ''), /Invalid token|Authentication required/);
});

test('GET /api/student/quizzes history returns 401 if JWT is missing', async () => {
  const res = await request(app)
    .get('/api/student/quizzes/history')
    .expect(401);

  assert.equal(res.status, 401);
  assert.strictEqual(typeof res.body, 'object');
  assert.equal(Boolean(res.body && res.body.success === false), true);
  assert.match(String(res.body.message || ''), /Authentication required|No token provided/);
});

test('GET /api/student/quizzes/:quizId rejects invalid quiz id', async () => {
  const res = await request(app)
    .get('/api/student/quizzes/abc')
    .set('Authorization', `Bearer ${validToken}`)
    .expect(400);

  assert.equal(res.status, 400);
  assert.strictEqual(typeof res.body, 'object');
  assert.equal(Boolean(res.body && res.body.success === false), true);
});

test('POST /api/student/quizzes/:quizId/submit rejects invalid answer submission payload', async () => {
  const res = await request(app)
    .post(`/api/student/quizzes/${fakeQuizId}/submit`)
    .set('Authorization', `Bearer ${validToken}`)
    .send({ answers: [{ questionId: 'one', selectedOptionId: 'two' }] })
    .expect(400);

  assert.equal(res.status, 400);
  assert.strictEqual(typeof res.body, 'object');
  assert.equal(Boolean(res.body && res.body.success === false), true);
});
