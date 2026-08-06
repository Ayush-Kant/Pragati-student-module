// ─────────────────────────────────────────────────────────────────────────────
//  skillsValidator.js
//  Validation rules for skills and certifications.
//
//  All validators return: { valid: boolean, errors: string[], sanitized: object }
// ─────────────────────────────────────────────────────────────────────────────

import { sanitizeString, sanitizeUrl } from '../utils/studentProfileHelpers.js';

const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];

/**
 * validateSkill
 * ──────────────
 * Validates a POST /skills or PUT /skills/:id payload.
 *
 * @param {object}  body
 * @param {boolean} [requireName=true] - Set false for partial updates (PUT).
 * @returns {{ valid: boolean, errors: string[], sanitized: object }}
 */
export const validateSkill = (body, requireName = true) => {
    const errors    = [];
    const sanitized = {};

    // skillName (required on POST, optional on PUT)
    if (requireName || body.skillName !== undefined) {
        const v = sanitizeString(body.skillName);
        if (!v) {
            errors.push('Skill name is required');
        } else if (v.length > 120) {
            errors.push('Skill name must not exceed 120 characters');
        } else {
            sanitized.skillName = v;
        }
    }

    // skillLevel (optional, must be from allowed list)
    if (body.skillLevel !== undefined) {
        const v = sanitizeString(body.skillLevel)?.toLowerCase();
        if (!v) {
            sanitized.skillLevel = null;
        } else if (!SKILL_LEVELS.includes(v)) {
            errors.push(`Skill level must be one of: ${SKILL_LEVELS.join(', ')}`);
        } else {
            sanitized.skillLevel = v;
        }
    }

    // category (optional, free-text)
    if (body.category !== undefined) {
        const v = sanitizeString(body.category);
        if (v && v.length > 100) errors.push('Category must not exceed 100 characters');
        else sanitized.category = v;
    }

    return { valid: errors.length === 0, errors, sanitized };
};

/**
 * validateCertification
 * ──────────────────────
 * Validates a POST /certifications payload.
 *
 * @param {object} body
 * @returns {{ valid: boolean, errors: string[], sanitized: object }}
 */
export const validateCertification = (body) => {
    const errors    = [];
    const sanitized = {};

    // name (required)
    const name = sanitizeString(body.name);
    if (!name) {
        errors.push('Certification name is required');
    } else if (name.length > 255) {
        errors.push('Certification name must not exceed 255 characters');
    } else {
        sanitized.name = name;
    }

    // issuingOrganization (optional)
    if (body.issuingOrganization !== undefined) {
        const v = sanitizeString(body.issuingOrganization);
        if (v && v.length > 255) errors.push('Issuing organization must not exceed 255 characters');
        else sanitized.issuingOrganization = v;
    }

    // issueDate (optional, must be a valid past date)
    if (body.issueDate !== undefined) {
        const v = sanitizeString(body.issueDate);
        const d = new Date(v);
        if (!v || isNaN(d.getTime())) {
            errors.push('Issue date must be a valid date (YYYY-MM-DD)');
        } else if (d > new Date()) {
            errors.push('Issue date cannot be in the future');
        } else {
            sanitized.issueDate = v;
        }
    }

    // expiryDate (optional, must be after issueDate)
    if (body.expiryDate !== undefined) {
        const v = sanitizeString(body.expiryDate);
        const d = new Date(v);
        if (!v || isNaN(d.getTime())) {
            errors.push('Expiry date must be a valid date (YYYY-MM-DD)');
        } else {
            if (sanitized.issueDate && d <= new Date(sanitized.issueDate)) {
                errors.push('Expiry date must be after issue date');
            } else {
                sanitized.expiryDate = v;
            }
        }
    }

    // credentialId (optional)
    if (body.credentialId !== undefined) {
        const v = sanitizeString(body.credentialId);
        if (v && v.length > 200) errors.push('Credential ID must not exceed 200 characters');
        else sanitized.credentialId = v;
    }

    // credentialUrl (optional)
    if (body.credentialUrl !== undefined) {
        const v = sanitizeUrl(body.credentialUrl);
        if (v) {
            try {
                new globalThis.URL(v); // Throws if invalid
                sanitized.credentialUrl = v;
            } catch {
                errors.push('Credential URL must be a valid URL');
            }
        } else {
            sanitized.credentialUrl = null;
        }
    }

    return { valid: errors.length === 0, errors, sanitized };
};
