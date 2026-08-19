/**
 * Submission helpers for the Advanced Project Workspace (MOD-07).
 * Pure functions only — no side effects, no React imports.
 */

import { SUBMISSION_STATE, UPLOAD_STATE } from '../constants/projectConstants';

// ─── File Size Formatting ──────────────────────────────────────────────────────

/**
 * Format a file size in bytes to a human-readable string.
 * @param {number} bytes
 * @returns {string} e.g. "2.4 MB", "840 KB", "512 B"
 */
export function formatFileSize(bytes) {
  if (bytes === null || bytes === undefined) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Upload State Machine ──────────────────────────────────────────────────────

/**
 * Create an initial file entry object for the upload list.
 * @param {File} file
 * @returns {object}
 */
export function createFileEntry(file) {
  return {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    state: UPLOAD_STATE.IDLE,
    progress: 0,
    error: null,
    uploadedFileId: null, // set after successful upload
  };
}

/**
 * Transition a file entry to the uploading state.
 * @param {object} entry
 * @returns {object}
 */
export function startUpload(entry) {
  return { ...entry, state: UPLOAD_STATE.UPLOADING, progress: 0, error: null };
}

/**
 * Update progress on a file entry.
 * @param {object} entry
 * @param {number} progress — 0..100
 * @returns {object}
 */
export function updateProgress(entry, progress) {
  return { ...entry, progress };
}

/**
 * Transition a file entry to the success state.
 * @param {object} entry
 * @param {string} uploadedFileId — server-assigned ID.
 * @returns {object}
 */
export function markUploadSuccess(entry, uploadedFileId) {
  return {
    ...entry,
    state: UPLOAD_STATE.SUCCESS,
    progress: 100,
    error: null,
    uploadedFileId,
  };
}

/**
 * Transition a file entry to the error state.
 * @param {object} entry
 * @param {string} error
 * @returns {object}
 */
export function markUploadError(entry, error) {
  return { ...entry, state: UPLOAD_STATE.ERROR, error, progress: 0 };
}

/**
 * Transition a file entry to the cancelled state.
 * @param {object} entry
 * @returns {object}
 */
export function markUploadCancelled(entry) {
  return {
    ...entry,
    state: UPLOAD_STATE.CANCELLED,
    progress: 0,
    error: null,
  };
}

// ─── Submission Workflow ────────────────────────────────────────────────────────

/**
 * Check whether the submission state allows the user to edit the form.
 * @param {string} submissionState
 * @returns {boolean}
 */
export function canEditSubmission(submissionState) {
  return [
    SUBMISSION_STATE.DRAFT,
    SUBMISSION_STATE.READY,
    null,
    undefined,
  ].includes(submissionState);
}

/**
 * Check whether the submission state allows triggering submit.
 * @param {string} submissionState
 * @returns {boolean}
 */
export function canSubmit(submissionState) {
  return submissionState === SUBMISSION_STATE.READY;
}

/**
 * Get a human-friendly label for a submission state.
 * @param {string} state
 * @returns {string}
 */
export function getSubmissionStateLabel(state) {
  const labels = {
    [SUBMISSION_STATE.DRAFT]:       'Draft',
    [SUBMISSION_STATE.VALIDATING]:  'Validating…',
    [SUBMISSION_STATE.UPLOADING]:   'Uploading files…',
    [SUBMISSION_STATE.READY]:       'Ready to Submit',
    [SUBMISSION_STATE.SUBMITTING]:  'Submitting…',
    [SUBMISSION_STATE.SUBMITTED]:   'Submitted',
    [SUBMISSION_STATE.UNDER_REVIEW]:'Under Review',
    [SUBMISSION_STATE.EVALUATED]:   'Evaluated',
  };
  return labels[state] ?? state ?? 'Unknown';
}

/**
 * Get a Tailwind colour class for a submission state.
 * @param {string} state
 * @returns {string}
 */
export function getSubmissionStateColor(state) {
  const colors = {
    [SUBMISSION_STATE.DRAFT]:       'text-gray-400',
    [SUBMISSION_STATE.VALIDATING]:  'text-yellow-400',
    [SUBMISSION_STATE.UPLOADING]:   'text-blue-400',
    [SUBMISSION_STATE.READY]:       'text-teal-400',
    [SUBMISSION_STATE.SUBMITTING]:  'text-violet-400',
    [SUBMISSION_STATE.SUBMITTED]:   'text-violet-400',
    [SUBMISSION_STATE.UNDER_REVIEW]:'text-yellow-400',
    [SUBMISSION_STATE.EVALUATED]:   'text-emerald-400',
  };
  return colors[state] ?? 'text-gray-400';
}

/**
 * Calculate total bytes across a list of file entries.
 * @param {object[]} fileEntries
 * @returns {number}
 */
export function computeTotalBytes(fileEntries) {
  return fileEntries.reduce((acc, e) => acc + (e.size ?? 0), 0);
}

/**
 * Get file entries that are in the success state.
 * @param {object[]} fileEntries
 * @returns {object[]}
 */
export function getSuccessfulUploads(fileEntries) {
  return fileEntries.filter((e) => e.state === UPLOAD_STATE.SUCCESS);
}

/**
 * Get file IDs of successfully uploaded files.
 * @param {object[]} fileEntries
 * @returns {string[]}
 */
export function getUploadedFileIds(fileEntries) {
  return getSuccessfulUploads(fileEntries)
    .map((e) => e.uploadedFileId)
    .filter(Boolean);
}
