/** Validation layer for the Student Projects feature. */
import { ACCEPTED_FILE_TYPES, MAX_FILE_BYTES, MAX_TOTAL_UPLOAD_BYTES } from '../constants/projectConstants';

const ok = () => ({ isValid: true, errors: [] });
const fail = (...errors) => ({ isValid: false, errors });
const isNil = (value) => value === null || value === undefined || value === '';

const isValidHttpsUrl = (value) => { try { const url = new URL(String(value)); return url.protocol === 'https:'; } catch { return false; } };

export function validateProjectId(projectId) {
  if (isNil(projectId)) return fail('Project ID is required.');
  if (typeof projectId !== 'string') return fail('Project ID must be a string.');
  return ok();
}

export function validateGithubUrl(url) {
  if (isNil(url)) return fail('GitHub repository URL is required.');
  if (!/^https:\/\/github\.com\//i.test(String(url).trim())) return fail('GitHub URL must start with https://github.com/.');
  return ok();
}

export function validateDeploymentUrl(url) {
  if (!url || !url.trim()) return ok();
  return isValidHttpsUrl(url) ? ok() : fail('Deployment URL must be a valid HTTPS URL.');
}

export function validateSubmissionDescription(description) {
  if (isNil(description)) return fail('Project description is required.');
  const value = String(description).trim();
  if (value.length < 30) return fail('Description must be at least 30 characters.');
  if (value.length > 2000) return fail('Description must not exceed 2000 characters.');
  return ok();
}

export function validateSubmissionPayload(payload) {
  if (isNil(payload)) return fail('Submission payload is missing.');
  const errors = [];
  const github = validateGithubUrl(payload.githubUrl); if (!github.isValid) errors.push(...github.errors);
  const deploy = validateDeploymentUrl(payload.deploymentUrl); if (!deploy.isValid) errors.push(...deploy.errors);
  const desc = validateSubmissionDescription(payload.description); if (!desc.isValid) errors.push(...desc.errors);
  if (payload.additionalComments && String(payload.additionalComments).length > 2000) errors.push('Additional comments must not exceed 2000 characters.');
  if (payload.reportFile) {
    if (payload.reportFile.type !== 'application/pdf') errors.push('Final project report must be a PDF.');
    if (payload.reportFile.size > 20 * 1024 * 1024) errors.push('Final project report must be 20MB or smaller.');
  }
  return errors.length ? fail(...errors) : ok();
}

export function validateFile(file) {
  if (!file) return fail('No file provided.');
  const errors = [];
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) errors.push(`"${file.name}" has an unsupported file type.`);
  if (file.size > MAX_FILE_BYTES) errors.push(`"${file.name}" exceeds the per-file limit.`);
  return errors.length ? fail(...errors) : ok();
}

export function validateFileBatch(newFiles, existingTotalBytes = 0) {
  if (!Array.isArray(newFiles) || newFiles.length === 0) return fail('No files selected.');
  const errors = []; let totalBytes = existingTotalBytes;
  for (const file of newFiles) { const result = validateFile(file); if (!result.isValid) errors.push(...result.errors); totalBytes += file.size; }
  if (totalBytes > MAX_TOTAL_UPLOAD_BYTES) errors.push('Total upload size exceeds the configured limit.');
  return errors.length ? fail(...errors) : ok();
}
