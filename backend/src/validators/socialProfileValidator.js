// ─────────────────────────────────────────────────────────────────────────────
//  socialProfileValidator.js
//  Validation rules for social profile links.
//
//  All validators return: { valid: boolean, errors: string[], sanitized: object }
// ─────────────────────────────────────────────────────────────────────────────

import { sanitizeUrl } from '../utils/studentProfileHelpers.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

const isValidUrl = (v) => {
    try { new globalThis.URL(v); return true; } catch { return false; }
};

/**
 * Validates and sanitizes a URL field.
 * Returns { value, error } — error is null on success.
 */
const checkUrl = (raw, fieldName, { required = false, domain = null } = {}) => {
    const v = sanitizeUrl(raw);

    if (!v) {
        if (required) return { value: null, error: `${fieldName} is required` };
        return { value: null, error: null }; // optional, cleared to null
    }

    if (!isValidUrl(v)) {
        return { value: null, error: `${fieldName} must be a valid URL (include https://)` };
    }

    if (domain) {
        try {
            const hostname = new globalThis.URL(v).hostname.toLowerCase();
            if (!hostname.includes(domain)) {
                return { value: null, error: `${fieldName} must be a ${domain} URL` };
            }
        } catch {
            return { value: null, error: `${fieldName} must be a valid URL` };
        }
    }

    if (v.length > 2048) {
        return { value: null, error: `${fieldName} must not exceed 2048 characters` };
    }

    return { value: v, error: null };
};

// ── Validator ─────────────────────────────────────────────────────────────────

/**
 * validateSocialProfiles
 * ───────────────────────
 * Validates a PUT /profile/social payload.
 * All fields are optional. At least one must be provided.
 *
 * @param {object} body
 * @returns {{ valid: boolean, errors: string[], sanitized: object }}
 */
export const validateSocialProfiles = (body) => {
    const errors    = [];
    const sanitized = {};

    const knownKeys = ['linkedinUrl', 'githubUrl', 'portfolioUrl', 'twitterUrl', 'websiteUrl'];
    const provided  = knownKeys.filter((k) => body[k] !== undefined);

    if (provided.length === 0) {
        return {
            valid:     false,
            errors:    ['At least one social profile URL must be provided'],
            sanitized: {},
        };
    }

    if (body.linkedinUrl !== undefined) {
        const { value, error } = checkUrl(body.linkedinUrl, 'LinkedIn URL', { domain: 'linkedin.com' });
        if (error) errors.push(error);
        else sanitized.linkedinUrl = value;
    }

    if (body.githubUrl !== undefined) {
        const { value, error } = checkUrl(body.githubUrl, 'GitHub URL', { domain: 'github.com' });
        if (error) errors.push(error);
        else sanitized.githubUrl = value;
    }

    if (body.portfolioUrl !== undefined) {
        const { value, error } = checkUrl(body.portfolioUrl, 'Portfolio URL');
        if (error) errors.push(error);
        else sanitized.portfolioUrl = value;
    }

    if (body.twitterUrl !== undefined) {
        const { value, error } = checkUrl(body.twitterUrl, 'Twitter URL', { domain: 'twitter.com' });
        if (error) errors.push(error);
        else sanitized.twitterUrl = value;
    }

    if (body.websiteUrl !== undefined) {
        const { value, error } = checkUrl(body.websiteUrl, 'Website URL');
        if (error) errors.push(error);
        else sanitized.websiteUrl = value;
    }

    return { valid: errors.length === 0, errors, sanitized };
};
