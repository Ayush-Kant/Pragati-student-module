// ─────────────────────────────────────────────────────────────────────────────
//  socialProfileController.js
//  Request/Response handling for social profile endpoints.
//
//  Routes:
//    GET  /api/student/profile/social
//    PUT  /api/student/profile/social
// ─────────────────────────────────────────────────────────────────────────────

import {
    getSocialProfiles    as svcGet,
    updateSocialProfiles as svcUpdate,
} from '../services/socialProfileService.js';

/**
 * getSocialProfiles
 * GET /api/student/profile/social
 */
export const getSocialProfiles = async (req, res, next) => {
    try {
        const result = await svcGet(req.user.userId);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * updateSocialProfiles
 * PUT /api/student/profile/social
 */
export const updateSocialProfiles = async (req, res, next) => {
    try {
        const result = await svcUpdate(req.user.userId, req.body);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};
