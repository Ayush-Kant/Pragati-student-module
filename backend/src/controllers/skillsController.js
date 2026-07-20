// ─────────────────────────────────────────────────────────────────────────────
//  skillsController.js
//  Request/Response handling for skills and certifications endpoints.
//
//  Routes:
//    GET    /api/student/profile/skills
//    POST   /api/student/profile/skills
//    PUT    /api/student/profile/skills/:id
//    DELETE /api/student/profile/skills/:id
//    GET    /api/student/profile/certifications
//    POST   /api/student/profile/certifications
//    DELETE /api/student/profile/certifications/:id
// ─────────────────────────────────────────────────────────────────────────────

import {
    getSkills          as svcGetSkills,
    addSkill           as svcAddSkill,
    updateSkill        as svcUpdateSkill,
    deleteSkill        as svcDeleteSkill,
    getCertifications  as svcGetCerts,
    addCertification   as svcAddCert,
    deleteCertification as svcDeleteCert,
} from '../services/skillsService.js';

/**
 * getSkills
 * GET /api/student/profile/skills
 */
export const getSkills = async (req, res, next) => {
    try {
        const result = await svcGetSkills(req.user.userId);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * addSkill
 * POST /api/student/profile/skills
 */
export const addSkill = async (req, res, next) => {
    try {
        const result = await svcAddSkill(req.user.userId, req.body);
        return res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * updateSkill
 * PUT /api/student/profile/skills/:id
 */
export const updateSkill = async (req, res, next) => {
    try {
        const skillId = parseInt(req.params.id, 10);
        if (isNaN(skillId) || skillId < 1) {
            return res.status(400).json({ success: false, message: 'Invalid skill ID' });
        }
        const result = await svcUpdateSkill(req.user.userId, skillId, req.body);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * deleteSkill
 * DELETE /api/student/profile/skills/:id
 */
export const deleteSkill = async (req, res, next) => {
    try {
        const skillId = parseInt(req.params.id, 10);
        if (isNaN(skillId) || skillId < 1) {
            return res.status(400).json({ success: false, message: 'Invalid skill ID' });
        }
        const result = await svcDeleteSkill(req.user.userId, skillId);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * getCertifications
 * GET /api/student/profile/certifications
 */
export const getCertifications = async (req, res, next) => {
    try {
        const result = await svcGetCerts(req.user.userId);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * addCertification
 * POST /api/student/profile/certifications
 */
export const addCertification = async (req, res, next) => {
    try {
        const result = await svcAddCert(req.user.userId, req.body);
        return res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * deleteCertification
 * DELETE /api/student/profile/certifications/:id
 */
export const deleteCertification = async (req, res, next) => {
    try {
        const certId = parseInt(req.params.id, 10);
        if (isNaN(certId) || certId < 1) {
            return res.status(400).json({ success: false, message: 'Invalid certification ID' });
        }
        const result = await svcDeleteCert(req.user.userId, certId);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};
