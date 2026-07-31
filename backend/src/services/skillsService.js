// ─────────────────────────────────────────────────────────────────────────────
//  skillsService.js
//  Business logic for skills and certifications management.
//
//  Functions:
//    • getSkills()
//    • addSkill()
//    • updateSkill()
//    • deleteSkill()
//    • getCertifications()
//    • addCertification()
//    • deleteCertification()
// ─────────────────────────────────────────────────────────────────────────────

import {
    getSkills         as modelGetSkills,
    addSkill          as modelAddSkill,
    updateSkill       as modelUpdateSkill,
    deleteSkill       as modelDeleteSkill,
    getCertifications as modelGetCerts,
    addCertification  as modelAddCert,
    deleteCertification as modelDeleteCert,
} from '../models/skillsModel.js';

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
 * getSkills
 * ──────────
 * @param {string} uuidId
 * @returns {Promise<object>}
 */
export const getSkills = async (uuidId) => {
    const { studentId } = await _requireStudent(uuidId);
    const skills = await modelGetSkills(studentId);
    return successResponse(skills, 'Skills retrieved successfully');
};

/**
 * addSkill
 * ─────────
 * @param {string} uuidId
 * @param {object} skillData
 * @returns {Promise<object>}
 */
export const addSkill = async (uuidId, skillData) => {
    const { studentId } = await _requireStudent(uuidId);
    const skill = await modelAddSkill(studentId, skillData);
    return successResponse(skill, 'Skill added successfully');
};

/**
 * updateSkill
 * ────────────
 * @param {string} uuidId
 * @param {number} skillId
 * @param {object} skillData
 * @returns {Promise<object>}
 */
export const updateSkill = async (uuidId, skillId, skillData) => {
    const { studentId } = await _requireStudent(uuidId);
    const skill = await modelUpdateSkill(skillId, studentId, skillData);

    if (!skill) {
        const err = new Error('Skill not found or access denied');
        err.statusCode = 404;
        throw err;
    }

    return successResponse(skill, 'Skill updated successfully');
};

/**
 * deleteSkill
 * ────────────
 * @param {string} uuidId
 * @param {number} skillId
 * @returns {Promise<object>}
 */
export const deleteSkill = async (uuidId, skillId) => {
    const { studentId } = await _requireStudent(uuidId);
    const deleted = await modelDeleteSkill(skillId, studentId);

    if (!deleted) {
        const err = new Error('Skill not found or access denied');
        err.statusCode = 404;
        throw err;
    }

    return successResponse({ id: deleted.id }, 'Skill deleted successfully');
};

/**
 * getCertifications
 * ──────────────────
 * @param {string} uuidId
 * @returns {Promise<object>}
 */
export const getCertifications = async (uuidId) => {
    const { studentId } = await _requireStudent(uuidId);
    const certs = await modelGetCerts(studentId);
    return successResponse(certs, 'Certifications retrieved successfully');
};

/**
 * addCertification
 * ─────────────────
 * @param {string} uuidId
 * @param {object} certData
 * @returns {Promise<object>}
 */
export const addCertification = async (uuidId, certData) => {
    const { studentId } = await _requireStudent(uuidId);
    const cert = await modelAddCert(studentId, certData);
    return successResponse(cert, 'Certification added successfully');
};

/**
 * deleteCertification
 * ────────────────────
 * @param {string} uuidId
 * @param {number} certId
 * @returns {Promise<object>}
 */
export const deleteCertification = async (uuidId, certId) => {
    const { studentId } = await _requireStudent(uuidId);
    const deleted = await modelDeleteCert(certId, studentId);

    if (!deleted) {
        const err = new Error('Certification not found or access denied');
        err.statusCode = 404;
        throw err;
    }

    return successResponse({ id: deleted.id }, 'Certification deleted successfully');
};
