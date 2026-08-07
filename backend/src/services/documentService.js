// ─────────────────────────────────────────────────────────────────────────────
//  documentService.js
//  Business logic for document and resume management.
//
//  Functions:
//    • getDocuments()
//    • uploadDocument()
//    • deleteDocument()
//    • uploadResume()
// ─────────────────────────────────────────────────────────────────────────────

import {
    getDocuments   as modelGetDocs,
    uploadDocument as modelUploadDoc,
    deleteDocument as modelDeleteDoc,
    getResume      as modelGetResume,
    uploadResume   as modelUploadResume,
} from '../models/documentModel.js';

import { resolveStudentId, successResponse } from '../utils/studentProfileHelpers.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

const _requireStudent = async (uuidId) => {
    const student = await resolveStudentId(uuidId);
    if (!student) {
        const err = new Error('Student account not found');
        err.statusCode = 404;
        throw err;
    }
    return student;
};

// ── Service Functions ─────────────────────────────────────────────────────────

/**
 * getDocuments
 * ─────────────
 * Returns all general documents plus the resume in a unified response.
 *
 * @param {string} uuidId
 * @returns {Promise<object>}
 */
export const getDocuments = async (uuidId) => {
    const { studentId } = await _requireStudent(uuidId);
    const [documents, resume] = await Promise.all([
        modelGetDocs(studentId),
        modelGetResume(studentId),
    ]);

    return successResponse({ documents, resume: resume ?? null }, 'Documents retrieved successfully');
};

/**
 * uploadDocument
 * ───────────────
 * Uploads (registers) a new general document for the student.
 *
 * @param {string} uuidId
 * @param {object} documentData
 * @returns {Promise<object>}
 */
export const uploadDocument = async (uuidId, documentData) => {
    const { studentId } = await _requireStudent(uuidId);
    const document = await modelUploadDoc(studentId, documentData);
    return successResponse(document, 'Document uploaded successfully');
};

/**
 * deleteDocument
 * ───────────────
 * Deletes a general document by id.
 *
 * @param {string} uuidId
 * @param {number} documentId
 * @returns {Promise<object>}
 */
export const deleteDocument = async (uuidId, documentId) => {
    const { studentId } = await _requireStudent(uuidId);
    const deleted = await modelDeleteDoc(documentId, studentId);

    if (!deleted) {
        const err = new Error('Document not found or access denied');
        err.statusCode = 404;
        throw err;
    }

    return successResponse({ id: deleted.id }, 'Document deleted successfully');
};

/**
 * uploadResume
 * ─────────────
 * Upserts the student's resume record.
 *
 * @param {string} uuidId
 * @param {object} resumeData
 * @returns {Promise<object>}
 */
export const uploadResume = async (uuidId, resumeData) => {
    const { studentId } = await _requireStudent(uuidId);
    const resume = await modelUploadResume(studentId, resumeData);
    return successResponse(resume, 'Resume uploaded successfully');
};
