// ─────────────────────────────────────────────────────────────────────────────
//  documentValidator.js
//  Validation rules for document uploads and resume uploads.
//
//  Note: This project uses URL-based storage (files hosted externally).
//        Validation focuses on the URL, file metadata, and document name/type.
//
//  All validators return: { valid: boolean, errors: string[], sanitized: object }
// ─────────────────────────────────────────────────────────────────────────────

import { sanitizeString, sanitizeUrl } from '../utils/studentProfileHelpers.js';

// ── Constants ─────────────────────────────────────────────────────────────────

/** Allowed MIME types for general documents */
const ALLOWED_DOCUMENT_MIMES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/webp',
];

/** Allowed MIME types for resumes only */
const ALLOWED_RESUME_MIMES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

/** Maximum file size: 5 MB in bytes */
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_DOCUMENT_TYPES = [
    'marksheet', 'id_proof', 'offer_letter', 'experience_letter',
    'noc', 'bonafide', 'other',
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const isValidUrl = (v) => {
    try { new globalThis.URL(v); return true; } catch { return false; }
};

// ── Validators ────────────────────────────────────────────────────────────────

/**
 * validateDocument
 * ─────────────────
 * Validates a POST /documents payload.
 *
 * @param {object} body
 * @returns {{ valid: boolean, errors: string[], sanitized: object }}
 */
export const validateDocument = (body) => {
    const errors    = [];
    const sanitized = {};

    // documentName (required)
    const docName = sanitizeString(body.documentName);
    if (!docName) {
        errors.push('Document name is required');
    } else if (docName.length > 255) {
        errors.push('Document name must not exceed 255 characters');
    } else {
        sanitized.documentName = docName;
    }

    // documentType (optional, from allowed list)
    if (body.documentType !== undefined) {
        const v = sanitizeString(body.documentType)?.toLowerCase();
        if (v && !ALLOWED_DOCUMENT_TYPES.includes(v)) {
            errors.push(`Document type must be one of: ${ALLOWED_DOCUMENT_TYPES.join(', ')}`);
        } else {
            sanitized.documentType = v ?? null;
        }
    }

    // documentUrl (required, must be a valid URL)
    const docUrl = sanitizeUrl(body.documentUrl);
    if (!docUrl) {
        errors.push('Document URL is required');
    } else if (!isValidUrl(docUrl)) {
        errors.push('Document URL must be a valid URL');
    } else {
        sanitized.documentUrl = docUrl;
    }

    // fileName (optional)
    if (body.fileName !== undefined) {
        const v = sanitizeString(body.fileName);
        if (v && v.length > 255) errors.push('File name must not exceed 255 characters');
        else sanitized.fileName = v;
    }

    // fileSize (optional, in bytes, max 5 MB)
    if (body.fileSize !== undefined) {
        const v = Number(body.fileSize);
        if (!Number.isFinite(v) || v < 0) {
            errors.push('File size must be a non-negative number');
        } else if (v > MAX_FILE_SIZE_BYTES) {
            errors.push('File size must not exceed 5 MB');
        } else {
            sanitized.fileSize = v;
        }
    }

    // mimeType (optional, from allowed list)
    if (body.mimeType !== undefined) {
        const v = sanitizeString(body.mimeType)?.toLowerCase();
        if (v && !ALLOWED_DOCUMENT_MIMES.includes(v)) {
            errors.push(`File type must be one of: PDF, DOC, DOCX, JPEG, PNG, WEBP`);
        } else {
            sanitized.mimeType = v ?? null;
        }
    }

    return { valid: errors.length === 0, errors, sanitized };
};

/**
 * validateResume
 * ───────────────
 * Validates a POST /resume payload.
 * Stricter than general documents — resume must be PDF/DOC/DOCX only.
 *
 * @param {object} body
 * @returns {{ valid: boolean, errors: string[], sanitized: object }}
 */
export const validateResume = (body) => {
    const errors    = [];
    const sanitized = {};

    // resumeUrl (required)
    const resumeUrl = sanitizeUrl(body.resumeUrl);
    if (!resumeUrl) {
        errors.push('Resume URL is required');
    } else if (!isValidUrl(resumeUrl)) {
        errors.push('Resume URL must be a valid URL');
    } else {
        sanitized.resumeUrl = resumeUrl;
    }

    // fileName (optional)
    if (body.fileName !== undefined) {
        const v = sanitizeString(body.fileName);
        if (v && v.length > 255) errors.push('File name must not exceed 255 characters');
        else sanitized.fileName = v;
    }

    // fileSize (optional, max 5 MB)
    if (body.fileSize !== undefined) {
        const v = Number(body.fileSize);
        if (!Number.isFinite(v) || v < 0) {
            errors.push('File size must be a non-negative number');
        } else if (v > MAX_FILE_SIZE_BYTES) {
            errors.push('File size must not exceed 5 MB');
        } else {
            sanitized.fileSize = v;
        }
    }

    // mimeType (optional, must be PDF/DOC/DOCX)
    if (body.mimeType !== undefined) {
        const v = sanitizeString(body.mimeType)?.toLowerCase();
        if (v && !ALLOWED_RESUME_MIMES.includes(v)) {
            errors.push('Resume must be a PDF, DOC, or DOCX file');
        } else {
            sanitized.mimeType = v ?? null;
        }
    }

    return { valid: errors.length === 0, errors, sanitized };
};
