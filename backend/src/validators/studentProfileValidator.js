// ─────────────────────────────────────────────────────────────────────────────
//  studentProfileValidator.js
//  Validation rules for student profile, personal info, and contact info.
//
//  All validators return: { valid: boolean, errors: string[] }
// ─────────────────────────────────────────────────────────────────────────────

import { sanitizeString, sanitizeEmail, sanitizeUrl } from '../utils/studentProfileHelpers.js';

// ── Shared Regex Patterns ─────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;          // Indian 10-digit mobile numbers
const PINCODE_REGEX = /^\d{6}$/;             // Indian 6-digit pincode

// ── Helpers ───────────────────────────────────────────────────────────────────

const isValidEmail = (v) => EMAIL_REGEX.test(v);
const isValidPhone = (v) => PHONE_REGEX.test(String(v).replace(/\D/g, ''));
const isValidPincode = (v) => PINCODE_REGEX.test(String(v));

// ── Validators ────────────────────────────────────────────────────────────────

/**
 * validateStudentProfile
 * ───────────────────────
 * Validates a full student profile update payload.
 * All fields are optional (partial update allowed).
 *
 * @param {object} body
 * @returns {{ valid: boolean, errors: string[], sanitized: object }}
 */
export const validateStudentProfile = (body) => {
    const errors = [];
    const sanitized = {};

    if (body.fullName !== undefined) {
        const v = sanitizeString(body.fullName);
        if (!v) errors.push('Full name cannot be empty');
        else if (v.length < 2) errors.push('Full name must be at least 2 characters');
        else if (v.length > 100) errors.push('Full name must not exceed 100 characters');
        else sanitized.fullName = v;
    }

    if (body.phone !== undefined) {
        const v = sanitizeString(body.phone);
        if (!v) errors.push('Phone cannot be empty');
        else if (!isValidPhone(v)) errors.push('Phone must be a valid 10-digit Indian mobile number');
        else sanitized.phone = v;
    }

    if (body.bio !== undefined) {
        const v = sanitizeString(body.bio);
        if (v && v.length > 500) errors.push('Bio must not exceed 500 characters');
        else sanitized.bio = v;
    }

    if (body.gender !== undefined) {
        const allowed = ['male', 'female', 'other', 'prefer_not_to_say'];
        const v = sanitizeString(body.gender)?.toLowerCase();
        if (!v || !allowed.includes(v)) errors.push(`Gender must be one of: ${allowed.join(', ')}`);
        else sanitized.gender = v;
    }

    if (body.dateOfBirth !== undefined) {
        const v = sanitizeString(body.dateOfBirth);
        const d = new Date(v);
        if (!v || isNaN(d.getTime())) errors.push('Date of birth must be a valid date (YYYY-MM-DD)');
        else if (d > new Date()) errors.push('Date of birth cannot be in the future');
        else sanitized.dateOfBirth = v;
    }

    if (body.avatarUrl !== undefined) {
        const v = sanitizeUrl(body.avatarUrl);
        if (v && v.length > 2048) errors.push('Avatar URL must not exceed 2048 characters');
        else sanitized.avatarUrl = v;
    }

    if (body.college !== undefined) {
        const v = sanitizeString(body.college);
        if (v && v.length > 255) errors.push('College name must not exceed 255 characters');
        else sanitized.college = v;
    }

    if (body.branch !== undefined) {
        const v = sanitizeString(body.branch);
        if (v && v.length > 100) errors.push('Branch must not exceed 100 characters');
        else sanitized.branch = v;
    }

    return { valid: errors.length === 0, errors, sanitized };
};

/**
 * validatePersonalInformation
 * ────────────────────────────
 * Validates the PATCH /profile/personal payload.
 *
 * @param {object} body
 * @returns {{ valid: boolean, errors: string[], sanitized: object }}
 */
export const validatePersonalInformation = (body) => {
    return validateStudentProfile(body);
};

/**
 * validateContactInformation
 * ───────────────────────────
 * Validates the PATCH /profile/contact payload.
 *
 * @param {object} body
 * @returns {{ valid: boolean, errors: string[], sanitized: object }}
 */
export const validateContactInformation = (body) => {
    const errors = [];
    const sanitized = {};

    if (body.addressLine1 !== undefined) {
        const v = sanitizeString(body.addressLine1);
        if (v && v.length > 255) errors.push('Address line 1 must not exceed 255 characters');
        else sanitized.addressLine1 = v;
    }

    if (body.addressLine2 !== undefined) {
        const v = sanitizeString(body.addressLine2);
        if (v && v.length > 255) errors.push('Address line 2 must not exceed 255 characters');
        else sanitized.addressLine2 = v;
    }

    if (body.city !== undefined) {
        const v = sanitizeString(body.city);
        if (v && v.length > 100) errors.push('City must not exceed 100 characters');
        else sanitized.city = v;
    }

    if (body.state !== undefined) {
        const v = sanitizeString(body.state);
        if (v && v.length > 100) errors.push('State must not exceed 100 characters');
        else sanitized.state = v;
    }

    if (body.country !== undefined) {
        const v = sanitizeString(body.country);
        if (v && v.length > 100) errors.push('Country must not exceed 100 characters');
        else sanitized.country = v;
    }

    if (body.pincode !== undefined) {
        const v = sanitizeString(body.pincode);
        if (!v) errors.push('Pincode cannot be empty when provided');
        else if (!isValidPincode(v)) errors.push('Pincode must be a valid 6-digit Indian pincode');
        else sanitized.pincode = v;
    }

    if (body.alternatePhone !== undefined) {
        const v = sanitizeString(body.alternatePhone);
        if (v && !isValidPhone(v)) errors.push('Alternate phone must be a valid 10-digit Indian mobile number');
        else sanitized.alternatePhone = v;
    }

    if (body.alternateEmail !== undefined) {
        const v = sanitizeEmail(body.alternateEmail);
        if (v && !isValidEmail(v)) errors.push('Alternate email must be a valid email address');
        else sanitized.alternateEmail = v;
    }

    return { valid: errors.length === 0, errors, sanitized };
};

/**
 * sanitizeInput
 * ─────────────
 * General-purpose input sanitizer. Strips string fields in-place.
 *
 * @param {object} body - The request body to sanitize.
 * @returns {object} Sanitized copy.
 */
export const sanitizeInput = (body) => {
    const out = {};
    for (const [k, v] of Object.entries(body)) {
        if (typeof v === 'string') {
            out[k] = v.trim();
        } else {
            out[k] = v;
        }
    }
    return out;
};
