/** Validation layer for the Coding Challenges feature. */
import { SUPPORTED_LANGUAGES } from '../constants/codingChallengeConstants';

const MAX_CODE_LENGTH = 50000;
const ok = () => ({ isValid: true, errors: [] });
const fail = (...errors) => ({ isValid: false, errors });
const isNil = (value) => value === null || value === undefined || value === '';
const validLanguageValues = SUPPORTED_LANGUAGES.map((language) => language.value);

export function validateLanguage(language) {
  if (isNil(language)) return fail('Please select a programming language.');
  if (!validLanguageValues.includes(language)) return fail(`"${language}" is not a supported language.`);
  return ok();
}

export function validateCode(code) {
  if (isNil(code)) return fail('Code cannot be empty. Write a solution before submitting.');
  if (typeof code !== 'string') return fail('Invalid code format.');
  if (code.trim().length === 0) return fail('Code cannot be blank. Write a solution before submitting.');
  if (code.length > MAX_CODE_LENGTH) return fail(`Code must be ${MAX_CODE_LENGTH.toLocaleString()} characters or fewer.`);
  if (code.trim().length < 5) return fail('Code is too short to be a valid solution.');
  return ok();
}

export function validateExecutionRequest(payload) {
  if (isNil(payload)) return fail('Execution request payload is missing.');
  const errors = [];
  const language = validateLanguage(payload.language);
  const code = validateCode(payload.code);
  if (!language.isValid) errors.push(...language.errors);
  if (!code.isValid) errors.push(...code.errors);
  return errors.length ? fail(...errors) : ok();
}

export function validateSubmissionRequest(payload) {
  if (isNil(payload)) return fail('Submission payload is missing.');
  const errors = [];
  if (isNil(payload.challengeId)) errors.push('Challenge ID is required.');
  const execution = validateExecutionRequest(payload);
  if (!execution.isValid) errors.push(...execution.errors);
  return errors.length ? fail(...errors) : ok();
}

export function validateChallengeId(challengeId) {
  if (isNil(challengeId)) return fail('Challenge ID is required.');
  if (typeof challengeId !== 'string') return fail('Challenge ID must be a string.');
  return ok();
}
