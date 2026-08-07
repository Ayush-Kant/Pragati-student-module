// ─────────────────────────────────────────────────────────────────────────────
//  studentProfileRoutes.js
//
//  Base path (mounted in index.js): /api/student/profile
//
//  GET    /api/student/profile          → getStudentProfile
//  PUT    /api/student/profile          → updateStudentProfile
//  PATCH  /api/student/profile/personal → updatePersonalInformation
//  PATCH  /api/student/profile/contact  → updateContactInformation
// ─────────────────────────────────────────────────────────────────────────────

import express from 'express';

import authenticateJWT   from '../middleware/authenticateJWT.js';
import authorizeStudent  from '../middleware/authorizeStudent.js';
import { validateRequest } from '../middleware/validateRequest.js';

import {
    validateStudentProfile,
    validatePersonalInformation,
    validateContactInformation,
} from '../validators/studentProfileValidator.js';

import {
    getStudentProfile,
    updateStudentProfile,
    updatePersonalInformation,
    updateContactInformation,
} from '../controllers/studentProfileController.js';

const router = express.Router();

// Apply auth + role guard to every route in this file
router.use(authenticateJWT, authorizeStudent);

router.get(
    '/',
    getStudentProfile
);

router.put(
    '/',
    validateRequest(validateStudentProfile),
    updateStudentProfile
);

router.patch(
    '/personal',
    validateRequest(validatePersonalInformation),
    updatePersonalInformation
);

router.patch(
    '/contact',
    validateRequest(validateContactInformation),
    updateContactInformation
);

export default router;
