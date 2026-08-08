// ─────────────────────────────────────────────────────────────────────────────
//  studentProfileService.js
//  Business logic for student profile management.
//
//  Responsibilities:
//    • Resolve JWT userId → studentId
//    • Coordinate model calls
//    • Calculate & persist profile completeness
//    • Format responses
//
//  Functions:
//    • getStudentProfile()
//    • updateStudentProfile()
//    • updatePersonalInformation()
//    • updateContactInformation()
// ─────────────────────────────────────────────────────────────────────────────

import {
    getStudentProfile     as modelGetProfile,
    updateStudentProfile  as modelUpdateProfile,
    updatePersonalInformation as modelUpdatePersonal,
    updateContactInformation  as modelUpdateContact,
} from '../models/studentProfileModel.js';

import { getSkills }          from '../models/skillsModel.js';
import { getCertifications }  from '../models/skillsModel.js';
import { getDocuments, getResume } from '../models/documentModel.js';
import { getSocialProfiles }  from '../models/socialProfileModel.js';
import { getAcademicInformation } from '../models/academicModel.js';

import {
    resolveStudentId,
    calculateProfileCompleteness,
    successResponse,
} from '../utils/studentProfileHelpers.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * _requireStudent
 * ────────────────
 * Resolves the JWT uuidId to a studentId.
 * Throws a structured error object if resolution fails.
 *
 * @param {string} uuidId
 * @returns {Promise<{ studentId: number, fullName: string }>}
 */
const _requireStudent = async (uuidId) => {
    const student = await resolveStudentId(uuidId);
    if (!student) {
        const err = new Error('Student account not found');
        err.statusCode = 404;
        throw err;
    }
    return student;
};

/**
 * _refreshCompleteness
 * ─────────────────────
 * Re-calculates and persists profile completeness score after any mutation.
 *
 * @param {number} studentId
 */
const _refreshCompleteness = async (studentId) => {
    const [student, academic, skills, certifications, documents, resume, socialLinks] = await Promise.all([
        modelGetProfile(studentId),
        getAcademicInformation(studentId),
        getSkills(studentId),
        getCertifications(studentId),
        getDocuments(studentId),
        getResume(studentId),
        getSocialProfiles(studentId),
    ]);

    const allDocs = [...(documents || [])];
    if (resume) allDocs.push(resume);

    const score = calculateProfileCompleteness({
        student:        { fullName: student?.fullName, phone: student?.phone },
        studentProfile: student,
        academic,
        skills,
        certifications,
        documents:      allDocs,
        socialLinks,
    });

    // Persist the new score
    await modelUpdateProfile(studentId, { profileCompleteness: score });
    return score;
};

// ── Service Functions ─────────────────────────────────────────────────────────

/**
 * getStudentProfile
 * ──────────────────
 * Fetches the full merged profile for the authenticated student.
 *
 * @param {string} uuidId - JWT userId.
 * @returns {Promise<object>}
 */
export const getStudentProfile = async (uuidId) => {
    const { studentId } = await _requireStudent(uuidId);
    const profile = await modelGetProfile(studentId);

    if (!profile) {
        const err = new Error('Profile not found');
        err.statusCode = 404;
        throw err;
    }

    return successResponse(profile, 'Profile retrieved successfully');
};

/**
 * updateStudentProfile
 * ─────────────────────
 * Updates both core and extended profile fields.
 *
 * @param {string} uuidId
 * @param {object} profileData
 * @returns {Promise<object>}
 */
export const updateStudentProfile = async (uuidId, profileData) => {
    const { studentId } = await _requireStudent(uuidId);
    const updated = await modelUpdateProfile(studentId, profileData);
    await _refreshCompleteness(studentId);
    return successResponse(updated, 'Profile updated successfully');
};

/**
 * updatePersonalInformation
 * ──────────────────────────
 * Updates personal info fields (name, phone, gender, dob, avatar, bio).
 *
 * @param {string} uuidId
 * @param {object} personalData
 * @returns {Promise<object>}
 */
export const updatePersonalInformation = async (uuidId, personalData) => {
    const { studentId } = await _requireStudent(uuidId);
    const updated = await modelUpdatePersonal(studentId, personalData);
    await _refreshCompleteness(studentId);
    return successResponse(updated, 'Personal information updated successfully');
};

/**
 * updateContactInformation
 * ─────────────────────────
 * Updates contact fields (address, alternate phone/email).
 *
 * @param {string} uuidId
 * @param {object} contactData
 * @returns {Promise<object>}
 */
export const updateContactInformation = async (uuidId, contactData) => {
    const { studentId } = await _requireStudent(uuidId);
    const updated = await modelUpdateContact(studentId, contactData);
    await _refreshCompleteness(studentId);
    return successResponse(updated, 'Contact information updated successfully');
};
