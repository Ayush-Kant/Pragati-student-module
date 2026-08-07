// ─────────────────────────────────────────────────────────────────────────────
//  academicRoutes.js
//
//  Base path (mounted in index.js): /api/student/profile
//
//  GET  /api/student/profile/academic → getAcademicInformation
//  PUT  /api/student/profile/academic → updateAcademicInformation
// ─────────────────────────────────────────────────────────────────────────────

import express from 'express';

import authenticateJWT   from '../middleware/authenticateJWT.js';
import authorizeStudent  from '../middleware/authorizeStudent.js';
import { validateRequest } from '../middleware/validateRequest.js';

import { validateAcademicInformation } from '../validators/academicValidator.js';

import {
    getAcademicInformation,
    updateAcademicInformation,
} from '../controllers/academicController.js';

const router = express.Router();

router.use(authenticateJWT, authorizeStudent);

router.get(
    '/academic',
    getAcademicInformation
);

router.put(
    '/academic',
    validateRequest(validateAcademicInformation),
    updateAcademicInformation
);

export default router;
