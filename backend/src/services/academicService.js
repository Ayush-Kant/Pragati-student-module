// ─────────────────────────────────────────────────────────────────────────────
//  academicService.js
//  Business logic for academic information management.
//
//  Functions:
//    • getAcademicInformation()
//    • updateAcademicInformation()
// ─────────────────────────────────────────────────────────────────────────────

import {
    getAcademicInformation  as modelGet,
    updateAcademicInformation as modelUpdate,
} from '../models/academicModel.js';

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
 * getAcademicInformation
 * ───────────────────────
 * Fetches academic details for the authenticated student.
 *
 * @param {string} uuidId
 * @returns {Promise<object>}
 */
export const getAcademicInformation = async (uuidId) => {
    const { studentId } = await _requireStudent(uuidId);
    const academic = await modelGet(studentId);

    // Return empty shape if no record exists yet
    return successResponse(
        academic ?? {
            studentId,
            institutionName:  null,
            department:       null,
            course:           null,
            degree:           null,
            semester:         null,
            graduationYear:   null,
            cgpa:             null,
            enrollmentNumber: null,
            admissionYear:    null,
            academicEmail:    null,
        },
        'Academic information retrieved successfully'
    );
};

/**
 * updateAcademicInformation
 * ──────────────────────────
 * Upserts academic details for the authenticated student.
 *
 * @param {string} uuidId
 * @param {object} academicData
 * @returns {Promise<object>}
 */
export const updateAcademicInformation = async (uuidId, academicData) => {
    const { studentId } = await _requireStudent(uuidId);
    const updated = await modelUpdate(studentId, academicData);
    return successResponse(updated, 'Academic information updated successfully');
};
