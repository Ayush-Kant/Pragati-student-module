// ─────────────────────────────────────────────────────────────────────────────
//  studentProfileHelpers.js
//  Pure utility helpers for the Student Profile Management module.
//
//  No DB access here — deterministic, side-effect-free functions only.
//  DB-level resolution (uuid → students.id) uses resolveStudentId() below,
//  which calls the pool but is a shared utility across all services.
// ─────────────────────────────────────────────────────────────────────────────

import { pool } from '../../config/db.js';

// ── Student Identity Resolution ───────────────────────────────────────────────

/**
 * resolveStudentId
 * ─────────────────
 * Resolves a JWT uuid (`auth_users.uuid_id`) to the integer `students.id`.
 *
 * Join chain:
 *   auth_users (uuid_id = $1)
 *     → users       (auth_user_id = auth_users.id)
 *     → students    (email        = auth_users.email)
 *
 * @param {string} uuidId - JWT sub / userId field (auth_users.uuid_id).
 * @returns {Promise<{ studentId: number, fullName: string } | null>}
 */
export const resolveStudentId = async (uuidId) => {
    const result = await pool.query(
        `
        SELECT
            s.id        AS "studentId",
            s.full_name AS "fullName"
        FROM auth_users au
        JOIN users    u ON u.auth_user_id = au.id
        JOIN students s ON s.email        = au.email
        WHERE au.uuid_id = $1
        `,
        [uuidId]
    );

    return result.rows[0] ?? null;
};

// ── Response Formatting ───────────────────────────────────────────────────────

/**
 * successResponse
 * ───────────────
 * Builds a consistent success response payload.
 *
 * @param {object} data    - The response payload.
 * @param {string} message - Human-readable message.
 * @returns {{ success: true, message: string, data: object }}
 */
export const successResponse = (data, message = 'OK') => ({
    success: true,
    message,
    data,
});

/**
 * errorResponse
 * ─────────────
 * Builds a consistent error response payload.
 *
 * @param {string}   message - Human-readable error message.
 * @param {string[]} [errors] - Optional array of validation error strings.
 * @returns {{ success: false, message: string, errors?: string[] }}
 */
export const errorResponse = (message, errors) => {
    const payload = { success: false, message };
    if (errors && errors.length) payload.errors = errors;
    return payload;
};

// ── Input Sanitization ────────────────────────────────────────────────────────

/**
 * sanitizeString
 * ──────────────
 * Trims whitespace and collapses internal runs of whitespace to a single space.
 * Returns null for empty / whitespace-only input.
 *
 * @param {*} value
 * @returns {string|null}
 */
export const sanitizeString = (value) => {
    if (value === null || value === undefined) return null;
    const s = String(value).trim().replace(/\s+/g, ' ');
    return s.length > 0 ? s : null;
};

/**
 * sanitizeEmail
 * ─────────────
 * Lowercases and trims an email string.
 *
 * @param {*} value
 * @returns {string|null}
 */
export const sanitizeEmail = (value) => {
    if (value === null || value === undefined) return null;
    const s = String(value).toLowerCase().trim();
    return s.length > 0 ? s : null;
};

/**
 * sanitizeUrl
 * ───────────
 * Trims a URL string. Does not encode — just cleans leading/trailing space.
 *
 * @param {*} value
 * @returns {string|null}
 */
export const sanitizeUrl = (value) => {
    if (value === null || value === undefined) return null;
    const s = String(value).trim();
    return s.length > 0 ? s : null;
};

// ── Profile Completeness ─────────────────────────────────────────────────────

/**
 * calculateProfileCompleteness
 * ─────────────────────────────
 * Returns a 0–100 completeness score for a student's profile based on
 * which weighted sections have been filled.
 *
 * Weights:
 *   • personalInfo    20 pts  (name, phone, gender, dob)
 *   • contactInfo     15 pts  (address fields)
 *   • academicInfo    20 pts  (cgpa, course, semester, institution)
 *   • skills          15 pts  (at least 1 skill)
 *   • certifications  10 pts  (at least 1 certification)
 *   • documents       10 pts  (at least 1 document or resume)
 *   • socialProfiles  10 pts  (at least 1 social link)
 *
 * @param {object} profile - Aggregated profile data object.
 * @returns {number} Integer score 0–100.
 */
export const calculateProfileCompleteness = (profile) => {
    let score = 0;

    const { student, studentProfile, academic, skills, certifications, documents, socialLinks } = profile;

    // Personal info (20 pts)
    const personalScore = [
        student?.fullName,
        student?.phone,
        studentProfile?.gender,
        studentProfile?.dateOfBirth,
    ].filter(Boolean).length;
    score += Math.round((personalScore / 4) * 20);

    // Contact info (15 pts)
    const contactScore = [
        studentProfile?.addressLine1,
        studentProfile?.city,
        studentProfile?.state,
        studentProfile?.pincode,
    ].filter(Boolean).length;
    score += Math.round((contactScore / 4) * 15);

    // Academic info (20 pts)
    const academicScore = [
        academic?.institutionName,
        academic?.course,
        academic?.cgpa != null,
        academic?.semester != null,
    ].filter(Boolean).length;
    score += Math.round((academicScore / 4) * 20);

    // Skills (15 pts)
    if (skills && skills.length > 0) score += 15;

    // Certifications (10 pts)
    if (certifications && certifications.length > 0) score += 10;

    // Documents / resume (10 pts)
    if (documents && documents.length > 0) score += 10;

    // Social links (10 pts)
    const hasAnyLink = socialLinks && Object.values(socialLinks).some(
        (v) => typeof v === 'string' && v.trim().length > 0
    );
    if (hasAnyLink) score += 10;

    return Math.min(100, score);
};

// ── Phone Number Helpers ─────────────────────────────────────────────────────

/**
 * normalizePhone
 * ──────────────
 * Strips non-digit characters for consistent storage comparison.
 *
 * @param {string} phone
 * @returns {string}
 */
export const normalizePhone = (phone) =>
    String(phone).replace(/\D/g, '');
