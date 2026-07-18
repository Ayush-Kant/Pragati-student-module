// ─────────────────────────────────────────────────────────────────────────────
//  academicValidator.js
//  Validation rules for academic information.
//
//  All validators return: { valid: boolean, errors: string[], sanitized: object }
// ─────────────────────────────────────────────────────────────────────────────

import { sanitizeString, sanitizeEmail } from '../utils/studentProfileHelpers.js';

const CURRENT_YEAR = new Date().getFullYear();
const EMAIL_REGEX  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * validateAcademicInformation
 * ────────────────────────────
 * Validates the PUT /profile/academic payload.
 * All fields are optional (partial update).
 *
 * @param {object} body
 * @returns {{ valid: boolean, errors: string[], sanitized: object }}
 */
export const validateAcademicInformation = (body) => {
    const errors    = [];
    const sanitized = {};

    // institution_name
    if (body.institutionName !== undefined) {
        const v = sanitizeString(body.institutionName);
        if (v && v.length > 255) errors.push('Institution name must not exceed 255 characters');
        else sanitized.institutionName = v;
    }

    // department
    if (body.department !== undefined) {
        const v = sanitizeString(body.department);
        if (v && v.length > 150) errors.push('Department must not exceed 150 characters');
        else sanitized.department = v;
    }

    // course
    if (body.course !== undefined) {
        const v = sanitizeString(body.course);
        if (v && v.length > 150) errors.push('Course must not exceed 150 characters');
        else sanitized.course = v;
    }

    // degree
    if (body.degree !== undefined) {
        const v = sanitizeString(body.degree);
        if (v && v.length > 100) errors.push('Degree must not exceed 100 characters');
        else sanitized.degree = v;
    }

    // semester (1–12)
    if (body.semester !== undefined) {
        const v = Number(body.semester);
        if (!Number.isInteger(v) || v < 1 || v > 12) {
            errors.push('Semester must be a whole number between 1 and 12');
        } else {
            sanitized.semester = v;
        }
    }

    // graduation_year
    if (body.graduationYear !== undefined) {
        const v = Number(body.graduationYear);
        if (!Number.isInteger(v) || v < 1990 || v > CURRENT_YEAR + 10) {
            errors.push(`Graduation year must be between 1990 and ${CURRENT_YEAR + 10}`);
        } else {
            sanitized.graduationYear = v;
        }
    }

    // cgpa (0.00 – 10.00, 10-point scale)
    if (body.cgpa !== undefined) {
        const v = parseFloat(body.cgpa);
        if (isNaN(v) || v < 0 || v > 10) {
            errors.push('CGPA must be a number between 0.00 and 10.00');
        } else {
            sanitized.cgpa = Math.round(v * 100) / 100; // 2 decimal places
        }
    }

    // enrollment_number
    if (body.enrollmentNumber !== undefined) {
        const v = sanitizeString(body.enrollmentNumber);
        if (v && v.length > 100) errors.push('Enrollment number must not exceed 100 characters');
        else sanitized.enrollmentNumber = v;
    }

    // admission_year
    if (body.admissionYear !== undefined) {
        const v = Number(body.admissionYear);
        if (!Number.isInteger(v) || v < 1990 || v > CURRENT_YEAR) {
            errors.push(`Admission year must be between 1990 and ${CURRENT_YEAR}`);
        } else {
            sanitized.admissionYear = v;
        }
    }

    // admission year must not be after graduation year
    if (
        sanitized.admissionYear !== undefined &&
        sanitized.graduationYear !== undefined &&
        sanitized.admissionYear > sanitized.graduationYear
    ) {
        errors.push('Admission year cannot be after graduation year');
    }

    // academic_email
    if (body.academicEmail !== undefined) {
        const v = sanitizeEmail(body.academicEmail);
        if (v && !EMAIL_REGEX.test(v)) errors.push('Academic email must be a valid email address');
        else sanitized.academicEmail = v;
    }

    return { valid: errors.length === 0, errors, sanitized };
};
