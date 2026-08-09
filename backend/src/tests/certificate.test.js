import { describe, it, expect } from '@jest/globals';

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
    expect(certificateId).toMatch(/^CERT-/);
  });

  it('creates verification codes with the expected prefix', () => {
    const verificationCode = generateVerificationCode();
    expect(verificationCode).toMatch(/^VER-/);
  });

  it('returns a standardized API response payload', () => {
    const response = formatApiResponse(true, 'Certificate generated successfully', { id: 1 }, 201);
    expect(response.success).toBe(true);
    expect(response.message).toBe('Certificate generated successfully');
    expect(response.data.id).toBe(1);
    expect(response.statusCode).toBe(201);
  });

  it('formats dates into a readable string', () => {
    const formatted = formatDate('2026-08-01T10:00:00.000Z');
    expect(typeof formatted).toBe('string');
    expect(formatted.length).toBeGreaterThan(0);
  });

  it('treats earned achievements as eligible without trusting client flags', () => {
    const eligible = checkEligibility({ achievements: [{ status: 'earned' }], isEligible: true });
    expect(eligible).toBe(true);
  });

  it('does not trust a client-provided eligibility flag when it is the only signal', () => {
    const eligible = checkEligibility({ achievements: [], isEligible: true });
    expect(eligible).toBe(false);
  });

  it('parses numeric student ids from string values safely', () => {
    expect(resolveStudentId({ studentId: '42' })).toBe(42);
    expect(resolveStudentId({ id: '7' })).toBe(7);
    expect(resolveStudentId({ userId: '0' })).toBeNull();
  });
});

describe('certificate validation', () => {
  it('rejects invalid certificate ids', () => {
    const result = validateCertificateId('   ');
    expect(result.success).toBe(false);
  });

  it('requires certificate verification payload fields', () => {
    const result = validateVerificationRequest({});
    expect(result.success).toBe(false);
  });

  it('accepts earned achievement status', () => {
    const result = validateAchievementStatus('earned');
    expect(result.success).toBe(true);
  });

  it('rejects missing student context for eligibility validation', () => {
    const result = validateStudentEligibility({});
    expect(result.success).toBe(false);
  });
});
