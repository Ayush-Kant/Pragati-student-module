// ─────────────────────────────────────────────────────────────────────────────
//  socialProfileRoutes.js
//
//  Base path (mounted in index.js): /api/student/profile
//
//  GET  /api/student/profile/social → getSocialProfiles
//  PUT  /api/student/profile/social → updateSocialProfiles
// ─────────────────────────────────────────────────────────────────────────────

import express from 'express';

import authenticateJWT   from '../middleware/authenticateJWT.js';
import authorizeStudent  from '../middleware/authorizeStudent.js';
import { validateRequest } from '../middleware/validateRequest.js';

import { validateSocialProfiles } from '../validators/socialProfileValidator.js';

import {
    getSocialProfiles,
    updateSocialProfiles,
} from '../controllers/socialProfileController.js';

const router = express.Router();

router.use(authenticateJWT, authorizeStudent);

router.get('/social', getSocialProfiles);
router.put('/social', validateRequest(validateSocialProfiles), updateSocialProfiles);

export default router;
