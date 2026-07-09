// ─────────────────────────────────────────────────────────────────────────────
//  documentModel.js
//  Data access layer for student_documents and student_resumes tables.
//
//  Functions:
//    • getDocuments()    — list all documents for a student
//    • uploadDocument()  — insert a new document record
//    • deleteDocument()  — delete a document by id
//    • getResume()       — fetch the student's current resume record
//    • uploadResume()    — upsert the student's resume record
// ─────────────────────────────────────────────────────────────────────────────

import { pool } from '../../config/db.js';

// ── Row Mappers ───────────────────────────────────────────────────────────────

const toDocument = (row) => ({
    id:           row.id,
    studentId:    row.student_id,
    documentName: row.document_name,
    documentType: row.document_type,
    documentUrl:  row.document_url,
    fileName:     row.file_name,
    fileSize:     row.file_size,
    mimeType:     row.mime_type,
    uploadedAt:   row.uploaded_at,
    updatedAt:    row.updated_at,
});

const toResume = (row) => ({
    id:         row.id,
    studentId:  row.student_id,
    resumeUrl:  row.resume_url,
    fileName:   row.file_name,
    fileSize:   row.file_size,
    mimeType:   row.mime_type,
    uploadedAt: row.uploaded_at,
    updatedAt:  row.updated_at,
});

// ── DOCUMENT QUERIES ──────────────────────────────────────────────────────────

/**
 * getDocuments
 * ─────────────
 * Returns all documents for the given studentId, newest first.
 *
 * @param {number} studentId
 * @returns {Promise<object[]>}
 */
export const getDocuments = async (studentId) => {
    const result = await pool.query(
        `
        SELECT
            id, student_id, document_name, document_type, document_url,
            file_name, file_size, mime_type, uploaded_at, updated_at
        FROM   student_documents
        WHERE  student_id = $1
        ORDER  BY uploaded_at DESC
        `,
        [studentId]
    );

    return result.rows.map(toDocument);
};

/**
 * uploadDocument
 * ───────────────
 * Inserts a new document record.
 *
 * @param {number} studentId
 * @param {object} documentData
 * @returns {Promise<object>}
 */
export const uploadDocument = async (studentId, documentData) => {
    const {
        documentName,
        documentType = null,
        documentUrl,
        fileName     = null,
        fileSize     = null,
        mimeType     = null,
    } = documentData;

    const result = await pool.query(
        `
        INSERT INTO student_documents
            (student_id, document_name, document_type, document_url,
             file_name, file_size, mime_type, uploaded_at, updated_at)
        VALUES
            ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING
            id, student_id, document_name, document_type, document_url,
            file_name, file_size, mime_type, uploaded_at, updated_at
        `,
        [studentId, documentName, documentType, documentUrl, fileName, fileSize, mimeType]
    );

    return toDocument(result.rows[0]);
};

/**
 * deleteDocument
 * ───────────────
 * Deletes a document by id, ensuring ownership.
 *
 * @param {number} documentId
 * @param {number} studentId
 * @returns {Promise<{ id: number }|null>}
 */
export const deleteDocument = async (documentId, studentId) => {
    const result = await pool.query(
        `
        DELETE FROM student_documents
        WHERE  id = $1 AND student_id = $2
        RETURNING id
        `,
        [documentId, studentId]
    );

    return result.rows[0] ?? null;
};

// ── RESUME QUERIES ────────────────────────────────────────────────────────────

/**
 * getResume
 * ──────────
 * Fetches the resume record for the given studentId.
 *
 * @param {number} studentId
 * @returns {Promise<object|null>}
 */
export const getResume = async (studentId) => {
    const result = await pool.query(
        `
        SELECT
            id, student_id, resume_url, file_name, file_size,
            mime_type, uploaded_at, updated_at
        FROM   student_resumes
        WHERE  student_id = $1
        `,
        [studentId]
    );

    return result.rows[0] ? toResume(result.rows[0]) : null;
};

/**
 * uploadResume
 * ─────────────
 * Upserts the student's resume (one resume per student constraint).
 *
 * @param {number} studentId
 * @param {object} resumeData
 * @returns {Promise<object>}
 */
export const uploadResume = async (studentId, resumeData) => {
    const {
        resumeUrl,
        fileName = null,
        fileSize = null,
        mimeType = null,
    } = resumeData;

    const result = await pool.query(
        `
        INSERT INTO student_resumes
            (student_id, resume_url, file_name, file_size, mime_type, uploaded_at, updated_at)
        VALUES
            ($1, $2, $3, $4, $5, NOW(), NOW())
        ON CONFLICT (student_id)
        DO UPDATE SET
            resume_url  = EXCLUDED.resume_url,
            file_name   = EXCLUDED.file_name,
            file_size   = EXCLUDED.file_size,
            mime_type   = EXCLUDED.mime_type,
            updated_at  = NOW()
        RETURNING
            id, student_id, resume_url, file_name, file_size,
            mime_type, uploaded_at, updated_at
        `,
        [studentId, resumeUrl, fileName, fileSize, mimeType]
    );

    return toResume(result.rows[0]);
};
