// ─────────────────────────────────────────────────────────────────────────────
//  academicController.js
//  Request/Response handling for academic information endpoints.
//
//  Routes:
//    GET  /api/student/profile/academic
//    PUT  /api/student/profile/academic
// ─────────────────────────────────────────────────────────────────────────────

import {
    getAcademicInformation   as svcGet,
    updateAcademicInformation as svcUpdate,
} from '../services/academicService.js';

/**
 * getAcademicInformation
 * GET /api/student/profile/academic
 */
export const getAcademicInformation = async (req, res, next) => {
    try {
        const result = await svcGet(req.user.userId);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * updateAcademicInformation
 * PUT /api/student/profile/academic
 */
export const updateAcademicInformation = async (req, res, next) => {
    try {
        const result = await svcUpdate(req.user.userId, req.body);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};
