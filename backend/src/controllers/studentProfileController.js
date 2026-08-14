// ─────────────────────────────────────────────────────────────────────────────
//  studentProfileController.js
//  Request/Response handling for student profile endpoints.
//
//  Routes:
//    GET    /api/student/profile
//    PUT    /api/student/profile
//    PATCH  /api/student/profile/personal
//    PATCH  /api/student/profile/contact
// ─────────────────────────────────────────────────────────────────────────────

import {
    getStudentProfile        as svcGet,
    updateStudentProfile     as svcUpdate,
    updatePersonalInformation as svcUpdatePersonal,
    updateContactInformation  as svcUpdateContact,
} from '../services/studentProfileService.js';

/**
 * getStudentProfile
 * GET /api/student/profile
 */
export const getStudentProfile = async (req, res, next) => {
    try {
        const result = await svcGet(req.user.userId);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * updateStudentProfile
 * PUT /api/student/profile
 */
export const updateStudentProfile = async (req, res, next) => {
    try {
        const result = await svcUpdate(req.user.userId, req.body);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * updatePersonalInformation
 * PATCH /api/student/profile/personal
 */
export const updatePersonalInformation = async (req, res, next) => {
    try {
        const result = await svcUpdatePersonal(req.user.userId, req.body);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * updateContactInformation
 * PATCH /api/student/profile/contact
 */
export const updateContactInformation = async (req, res, next) => {
    try {
        const result = await svcUpdateContact(req.user.userId, req.body);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};
