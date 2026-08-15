import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  generateUniqueCertificateId,
  generateVerificationCode,
  formatApiResponse,
  formatDate,
  checkEligibility,
  resolveStudentId,
} from '../utils/certificateHelpers.js';

import {
  validateCertificateId,
  validateVerificationRequest,
  validateAchievementStatus,
  validateStudentEligibility,
} from '../validations/certificateValidation.js';

describe('certificate helpers', () => {
  it('creates certificate identifiers with the expected prefix', () => {
    const certificateId = generateUniqueCertificateId();
    assert.match(certificateId, /^CERT-/);
  });

  it('creates verification codes with the expected prefix', () => {
    const verificationCode = generateVerificationCode();
    assert.match(verificationCode, /^VER-/);
  });

  it('returns a standardized API response payload', () => {
    const response = formatApiResponse(true, 'Certificate generated successfully', { id: 1 }, 201);
    assert.strictEqual(response.success, true);
    assert.strictEqual(response.message, 'Certificate generated successfully');
    assert.strictEqual(response.data.id, 1);
    assert.strictEqual(response.statusCode, 201);
  });

  it('formats dates into a readable string', () => {
    const formatted = formatDate('2026-08-01T10:00:00.000Z');
    assert.strictEqual(typeof formatted, 'string');
    assert.ok(formatted.length > 0);
  });

  it('treats earned achievements as eligible without trusting client flags', () => {
    const eligible = checkEligibility({ achievements: [{ status: 'earned' }], isEligible: true });
    assert.strictEqual(eligible, true);
  });

  it('does not trust a client-provided eligibility flag when it is the only signal', () => {
    const eligible = checkEligibility({ achievements: [], isEligible: true });
    assert.strictEqual(eligible, false);
  });

  it('parses numeric student ids from string values safely', () => {
    assert.strictEqual(resolveStudentId({ studentId: '42' }), 42);
    assert.strictEqual(resolveStudentId({ id: '7' }), 7);
    assert.strictEqual(resolveStudentId({ userId: '0' }), null);
  });
});

describe('certificate validation', () => {
  it('rejects invalid certificate ids', () => {
    const result = validateCertificateId('   ');
    assert.strictEqual(result.success, false);
  });

  it('requires certificate verification payload fields', () => {
    const result = validateVerificationRequest({});
    assert.strictEqual(result.success, false);
  });

  it('accepts earned achievement status', () => {
    const result = validateAchievementStatus('earned');
    assert.strictEqual(result.success, true);
  });

  it('rejects missing student context for eligibility validation', () => {
    const result = validateStudentEligibility({});
    assert.strictEqual(result.success, false);
  });
});
