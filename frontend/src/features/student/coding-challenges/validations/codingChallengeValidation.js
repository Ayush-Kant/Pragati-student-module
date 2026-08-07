/**
 * Validation layer for the Coding Challenges feature.
 * Every function returns `{ isValid: boolean, errors: string[] }`.
 * Hooks call these before invoking service methods.
 */

import { SUPPORTED_LANGUAGES } from '../constants/codingChallengeConstants';

// ─── Helpers ───────────────────────────────────────────────────────────────────

const ok = () => ({ isValid: true, errors: [] });
const fail = (...errors) => ({ isValid: false, errors });

function isNil(value) {
  return value === null || value === undefined || value === '';
}

const validLanguageValues = SUPPORTED_LANGUAGES.map((l) => l.value);

// ─── Public Validators ─────────────────────────────────────────────────────────

/**
 * Validate that a language is selected and supported.
 * @param {string} language
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateLanguage(language) {
  if (isNil(language)) return fail('Please select a programming language.');
  if (!validLanguageValues.includes(language)) {
    return fail(`"${language}" is not a supported language.`);
  }
  return ok();
}

/**
 * Validate that the editor code is not empty.
 * @param {string} code
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateCode(code) {
  if (isNil(code)) return fail('Code cannot be empty. Write a solution before submitting.');
  if (typeof code !== 'string') return fail('Invalid code format.');
  if (code.trim().length === 0) return fail('Code cannot be blank. Write a solution before submitting.');
  if (code.trim().length < 5) return fail('Code is too short to be a valid solution.');
  return ok();
}

/**
 * Validate a full code execution request.
 * @param {{ language: string, code: string }} payload
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateExecutionRequest(payload) {
  if (isNil(payload)) return fail('Execution request payload is missing.');

  const errors = [];

  const langResult = validateLanguage(payload.language);
  if (!langResult.isValid) errors.push(...langResult.errors);

  const codeResult = validateCode(payload.code);
  if (!codeResult.isValid) errors.push(...codeResult.errors);

  return errors.length ? fail(...errors) : ok();
}

/**
 * Validate a full submission request.
 * @param {{ challengeId: string, language: string, code: string }} payload
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateSubmissionRequest(payload) {
  if (isNil(payload)) return fail('Submission payload is missing.');

  const errors = [];

  if (isNil(payload.challengeId)) {
    errors.push('Challenge ID is required.');
  }

  const execResult = validateExecutionRequest(payload);
  if (!execResult.isValid) errors.push(...execResult.errors);

  return errors.length ? fail(...errors) : ok();
}

/**
 * Validate a challenge ID string.
 * @param {string} challengeId
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateChallengeId(challengeId) {
  if (isNil(challengeId)) return fail('Challenge ID is required.');
  if (typeof challengeId !== 'string') return fail('Challenge ID must be a string.');
  return ok();
}
