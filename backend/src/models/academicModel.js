// ─────────────────────────────────────────────────────────────────────────────
//  academicModel.js
//  Data access layer for the academic_details table.
//
//  Functions:
//    • getAcademicInformation()    — fetch academic record by studentId
//    • updateAcademicInformation() — upsert academic record
// ─────────────────────────────────────────────────────────────────────────────

import { pool } from '../../config/db.js';

// ── Row Mapper ────────────────────────────────────────────────────────────────

const toAcademic = (row) => ({
    id:                 row.id,
    studentId:          row.student_id,
    institutionName:    row.institution_name,
    department:         row.department,
    course:             row.course,
    degree:             row.degree,
    semester:           row.semester,
    graduationYear:     row.graduation_year,
    cgpa:               row.cgpa !== null ? parseFloat(row.cgpa) : null,
    enrollmentNumber:   row.enrollment_number,
    admissionYear:      row.admission_year,
    academicEmail:      row.academic_email,
    createdAt:          row.created_at,
    updatedAt:          row.updated_at,
});

// ── Queries ───────────────────────────────────────────────────────────────────

/**
 * getAcademicInformation
 * ───────────────────────
 * Retrieves the academic record for the given studentId.
 *
 * @param {number} studentId
 * @returns {Promise<object|null>}
 */
export const getAcademicInformation = async (studentId) => {
    const result = await pool.query(
        `
        SELECT
            id,
            student_id,
            institution_name,
            department,
            course,
            degree,
            semester,
            graduation_year,
            cgpa,
            enrollment_number,
            admission_year,
            academic_email,
            created_at,
            updated_at
        FROM academic_details
        WHERE student_id = $1
        `,
        [studentId]
    );

    return result.rows[0] ? toAcademic(result.rows[0]) : null;
};

/**
 * updateAcademicInformation
 * ──────────────────────────
 * Upserts the academic record for the given studentId.
 * Only the fields present in academicData are updated.
 *
 * @param {number} studentId
 * @param {object} academicData
 * @returns {Promise<object>}
 */
export const updateAcademicInformation = async (studentId, academicData) => {
    const mapping = {
        institutionName:  'institution_name',
        department:       'department',
        course:           'course',
        degree:           'degree',
        semester:         'semester',
        graduationYear:   'graduation_year',
        cgpa:             'cgpa',
        enrollmentNumber: 'enrollment_number',
        admissionYear:    'admission_year',
        academicEmail:    'academic_email',
    };

    const columns = [];
    const values  = [];

    for (const [key, col] of Object.entries(mapping)) {
        if (academicData[key] !== undefined) {
            values.push(academicData[key]);
            columns.push({ col, idx: values.length });
        }
    }

    if (columns.length === 0) {
        // Nothing to update — return current record
        return getAcademicInformation(studentId);
    }

    const setClauses  = columns.map(({ col, idx }) => `${col} = $${idx}`).join(', ');
    const insertCols  = columns.map(({ col }) => col).join(', ');
    const insertPlaceholders = columns.map(({ idx }) => `$${idx}`).join(', ');

    // Push studentId as the last parameter
    values.push(studentId);
    const studentIdx = values.length;

    const result = await pool.query(
        `
        INSERT INTO academic_details
            (student_id, ${insertCols}, created_at, updated_at)
        VALUES
            ($${studentIdx}, ${insertPlaceholders}, NOW(), NOW())
        ON CONFLICT (student_id)
        DO UPDATE SET
            ${setClauses},
            updated_at = NOW()
        RETURNING
            id,
            student_id,
            institution_name,
            department,
            course,
            degree,
            semester,
            graduation_year,
            cgpa,
            enrollment_number,
            admission_year,
            academic_email,
            created_at,
            updated_at
        `,
        values
    );

    return toAcademic(result.rows[0]);
};
