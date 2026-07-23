// ─────────────────────────────────────────────────────────────────────────────
//  socialProfileService.js
//  Business logic for social profile links management.
//
//  Functions:
//    • getSocialProfiles()
//    • updateSocialProfiles()
// ─────────────────────────────────────────────────────────────────────────────

import {
    getSocialProfiles    as modelGet,
    updateSocialProfiles as modelUpdate,
} from '../models/socialProfileModel.js';

import { resolveStudentId, successResponse } from '../utils/studentProfileHelpers.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

const _requireStudent = async (uuidId) => {
    const student = await resolveStudentId(uuidId);
    if (!student) {
        const err = new Error('Student account not found');
        err.statusCode = 404;
        throw err;
    }
    return student;
};

// ── Service Functions ─────────────────────────────────────────────────────────

/**
 * getSocialProfiles
 * ──────────────────
 * Fetches social links for the authenticated student.
 * Always returns a consistent object (nulls if no record exists).
 *
 * @param {string} uuidId
 * @returns {Promise<object>}
 */
export const getSocialProfiles = async (uuidId) => {
    const { studentId } = await _requireStudent(uuidId);
    const social = await modelGet(studentId);
    return successResponse(social, 'Social profiles retrieved successfully');
};

/**
 * updateSocialProfiles
 * ─────────────────────
 * Upserts social links for the authenticated student.
 *
 * @param {string} uuidId
 * @param {object} socialData
 * @returns {Promise<object>}
 */
export const updateSocialProfiles = async (uuidId, socialData) => {
    const { studentId } = await _requireStudent(uuidId);
    const social = await modelUpdate(studentId, socialData);
    return successResponse(social, 'Social profiles updated successfully');
};
