// ─────────────────────────────────────────────────────────────────────────────
//  documentRoutes.js
//
//  Base path (mounted in index.js): /api/student/profile
//
//  GET    /api/student/profile/documents       → getDocuments
//  POST   /api/student/profile/documents       → uploadDocument
//  DELETE /api/student/profile/documents/:id   → deleteDocument
//  POST   /api/student/profile/resume          → uploadResume
// ─────────────────────────────────────────────────────────────────────────────

import express from 'express';

import authenticateJWT   from '../middleware/authenticateJWT.js';
import authorizeStudent  from '../middleware/authorizeStudent.js';
import { validateRequest } from '../middleware/validateRequest.js';

import { validateDocument, validateResume } from '../validators/documentValidator.js';

import {
    getDocuments,
    uploadDocument,
    deleteDocument,
    uploadResume,
} from '../controllers/documentController.js';

const router = express.Router();

router.use(authenticateJWT, authorizeStudent);

router.get('/documents',        getDocuments);
router.post('/documents',       validateRequest(validateDocument), uploadDocument);
router.delete('/documents/:id', deleteDocument);
router.post('/resume',          validateRequest(validateResume), uploadResume);

export default router;
