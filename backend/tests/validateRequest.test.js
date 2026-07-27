import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateRequest } from '../src/middleware/validateRequest.js';

test('validateRequest supports function-based validators', () => {
  const req = { body: { title: 'Test' } };
  const res = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
  let nextCalled = false;

  const validator = (data) => ({ value: data, error: null });

  validateRequest(validator, 'body')(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.deepEqual(req.validatedBody, { title: 'Test' });
  assert.equal(res.statusCode, null);
});
