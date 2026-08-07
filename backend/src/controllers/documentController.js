// ─────────────────────────────────────────────────────────────────────────────
//  documentController.js
//  Request/Response handling for document and resume endpoints.
//
//  Routes:
//    GET    /api/student/profile/documents
//    POST   /api/student/profile/documents
//    DELETE /api/student/profile/documents/:id
//    POST   /api/student/profile/resume
// ─────────────────────────────────────────────────────────────────────────────

import {
    getDocuments   as svcGetDocs,
    uploadDocument as svcUploadDoc,
    deleteDocument as svcDeleteDoc,
    uploadResume   as svcUploadResume,
} from '../services/documentService.js';

/**
 * getDocuments
 * GET /api/student/profile/documents
 */
export const getDocuments = async (req, res, next) => {
    try {
        const result = await svcGetDocs(req.user.userId);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * uploadDocument
 * POST /api/student/profile/documents
 */
export const uploadDocument = async (req, res, next) => {
    try {
        const result = await svcUploadDoc(req.user.userId, req.body);
        return res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * deleteDocument
 * DELETE /api/student/profile/documents/:id
 */
export const deleteDocument = async (req, res, next) => {
    try {
        const documentId = parseInt(req.params.id, 10);
        if (isNaN(documentId) || documentId < 1) {
            return res.status(400).json({ success: false, message: 'Invalid document ID' });
        }
        const result = await svcDeleteDoc(req.user.userId, documentId);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * uploadResume
 * POST /api/student/profile/resume
 */
export const uploadResume = async (req, res, next) => {
    try {
        const result = await svcUploadResume(req.user.userId, req.body);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};
