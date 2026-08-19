/**
 * Validation layer for the Advanced Project Workspace (MOD-07).
 * Every function returns `{ isValid: boolean, errors: string[] }`.
 * Hooks call these before invoking service methods.
 */

import {
  ACCEPTED_FILE_TYPES,
  MAX_FILE_BYTES,
  MAX_TOTAL_UPLOAD_BYTES,
} from '../constants/projectConstants';

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** @returns {{ isValid: true, errors: [] }} */
const ok = () => ({ isValid: true, errors: [] });

/** @returns {{ isValid: false, errors: string[] }} */
const fail = (...errors) => ({ isValid: false, errors });

/** @param {unknown} value */
function isNil(value) {
  return value === null || value === undefined || value === '';
}

/** @param {string} url */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ─── Project ID ────────────────────────────────────────────────────────────────

/**
 * Validate a project ID.
 * @param {string} projectId
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateProjectId(projectId) {
  if (isNil(projectId)) return fail('Project ID is required.');
  if (typeof projectId !== 'string') return fail('Project ID must be a string.');
  return ok();
}

// ─── Submission Form ───────────────────────────────────────────────────────────

/**
 * Validate the GitHub repository URL.
 * @param {string} url
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateGithubUrl(url) {
  if (isNil(url)) return fail('GitHub repository URL is required.');
  if (!isValidUrl(url)) return fail('GitHub URL is not a valid URL.');
  if (!url.toLowerCase().includes('github.com')) {
    return fail('URL must point to a GitHub repository (github.com).');
  }
  return ok();
}

/**
 * Validate the optional deployment URL.
 * @param {string | undefined} url
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateDeploymentUrl(url) {
  if (!url || url.trim() === '') return ok(); // optional
  if (!isValidUrl(url)) return fail('Deployment URL is not a valid URL.');
  return ok();
}

/**
 * Validate the project submission description.
 * @param {string} description
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateSubmissionDescription(description) {
  if (isNil(description)) return fail('Project description is required.');
  if (description.trim().length < 30) {
    return fail('Description must be at least 30 characters.');
  }
  if (description.trim().length > 2000) {
    return fail('Description must not exceed 2000 characters.');
  }
  return ok();
}

/**
 * Validate the complete submission form payload.
 * @param {{ githubUrl: string, deploymentUrl?: string, description: string, documentation?: string }} payload
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateSubmissionPayload(payload) {
  if (isNil(payload)) return fail('Submission payload is missing.');

  const errors = [];

  const githubResult = validateGithubUrl(payload.githubUrl);
  if (!githubResult.isValid) errors.push(...githubResult.errors);

  const deployResult = validateDeploymentUrl(payload.deploymentUrl);
  if (!deployResult.isValid) errors.push(...deployResult.errors);

  const descResult = validateSubmissionDescription(payload.description);
  if (!descResult.isValid) errors.push(...descResult.errors);

  return errors.length ? fail(...errors) : ok();
}

// ─── File Upload ───────────────────────────────────────────────────────────────

/**
 * Validate a single file before upload.
 * @param {File} file
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateFile(file) {
  if (!file) return fail('No file provided.');

  const errors = [];

  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    errors.push(
      `"${file.name}" has an unsupported file type. Accepted: PDF, ZIP, DOCX, images, TXT, MD.`
    );
  }

  if (file.size > MAX_FILE_BYTES) {
    const maxMB = Math.round(MAX_FILE_BYTES / 1024 / 1024);
    errors.push(`"${file.name}" exceeds the ${maxMB} MB per-file limit.`);
  }

  return errors.length ? fail(...errors) : ok();
}

/**
 * Validate a batch of files (individual + total size checks).
 * @param {File[]} newFiles  — Files the user is trying to add.
 * @param {number} existingTotalBytes — Bytes already uploaded.
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateFileBatch(newFiles, existingTotalBytes = 0) {
  if (!Array.isArray(newFiles) || newFiles.length === 0) {
    return fail('No files selected.');
  }

  const errors = [];

  let totalBytes = existingTotalBytes;
  for (const file of newFiles) {
    const result = validateFile(file);
    if (!result.isValid) errors.push(...result.errors);
    totalBytes += file.size;
  }

  if (totalBytes > MAX_TOTAL_UPLOAD_BYTES) {
    const maxMB = Math.round(MAX_TOTAL_UPLOAD_BYTES / 1024 / 1024);
    errors.push(`Total upload size would exceed the ${maxMB} MB limit.`);
  }

  return errors.length ? fail(...errors) : ok();
}
