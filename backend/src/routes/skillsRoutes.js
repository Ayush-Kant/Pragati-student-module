// ─────────────────────────────────────────────────────────────────────────────
//  skillsRoutes.js
//
//  Base path (mounted in index.js): /api/student/profile
//
//  GET    /api/student/profile/skills               → getSkills
//  POST   /api/student/profile/skills               → addSkill
//  PUT    /api/student/profile/skills/:id           → updateSkill
//  DELETE /api/student/profile/skills/:id           → deleteSkill
//  GET    /api/student/profile/certifications       → getCertifications
//  POST   /api/student/profile/certifications       → addCertification
//  DELETE /api/student/profile/certifications/:id   → deleteCertification
// ─────────────────────────────────────────────────────────────────────────────

import express from 'express';

import authenticateJWT   from '../middleware/authenticateJWT.js';
import authorizeStudent  from '../middleware/authorizeStudent.js';
import { validateRequest } from '../middleware/validateRequest.js';

import { validateSkill, validateCertification } from '../validators/skillsValidator.js';

import {
    getSkills,
    addSkill,
    updateSkill,
    deleteSkill,
    getCertifications,
    addCertification,
    deleteCertification,
} from '../controllers/skillsController.js';

const router = express.Router();

router.use(authenticateJWT, authorizeStudent);

// ── Skills ────────────────────────────────────────────────────────────────────

router.get('/skills',     getSkills);
router.post('/skills',    validateRequest(validateSkill), addSkill);
router.put('/skills/:id', validateRequest(validateSkill, { requireName: false }), updateSkill);
router.delete('/skills/:id', deleteSkill);

// ── Certifications ────────────────────────────────────────────────────────────

router.get('/certifications',       getCertifications);
router.post('/certifications',      validateRequest(validateCertification), addCertification);
router.delete('/certifications/:id', deleteCertification);

export default router;
