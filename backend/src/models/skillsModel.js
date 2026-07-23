// ─────────────────────────────────────────────────────────────────────────────
//  skillsModel.js
//  Data access layer for student_skills and certifications tables.
//
//  Functions:
//    • getSkills()          — list all skills for a student
//    • addSkill()           — insert / upsert a skill
//    • updateSkill()        — update a skill by id
//    • deleteSkill()        — delete a skill by id
//    • getCertifications()  — list all certifications for a student
//    • addCertification()   — insert a new certification
//    • deleteCertification() — delete a certification by id
// ─────────────────────────────────────────────────────────────────────────────

import { pool } from '../../config/db.js';

// ── Row Mappers ───────────────────────────────────────────────────────────────

const toSkill = (row) => ({
    id:         row.id,
    studentId:  row.student_id,
    skillName:  row.skill_name,
    skillLevel: row.skill_level,
    category:   row.category,
    createdAt:  row.created_at,
    updatedAt:  row.updated_at,
});

const toCertification = (row) => ({
    id:                   row.id,
    studentId:            row.student_id,
    name:                 row.name,
    issuingOrganization:  row.issuing_organization,
    issueDate:            row.issue_date,
    expiryDate:           row.expiry_date,
    credentialId:         row.credential_id,
    credentialUrl:        row.credential_url,
    createdAt:            row.created_at,
    updatedAt:            row.updated_at,
});

// ── SKILLS QUERIES ────────────────────────────────────────────────────────────

/**
 * getSkills
 * ──────────
 * Returns all skills for the given studentId, ordered by category then name.
 *
 * @param {number} studentId
 * @returns {Promise<object[]>}
 */
export const getSkills = async (studentId) => {
    const result = await pool.query(
        `
        SELECT id, student_id, skill_name, skill_level, category, created_at, updated_at
        FROM   student_skills
        WHERE  student_id = $1
        ORDER  BY category NULLS LAST, skill_name
        `,
        [studentId]
    );

    return result.rows.map(toSkill);
};

/**
 * addSkill
 * ─────────
 * Inserts a skill. On duplicate (student_id, skill_name), updates level/category.
 *
 * @param {number} studentId
 * @param {{ skillName: string, skillLevel?: string, category?: string }} skillData
 * @returns {Promise<object>}
 */
export const addSkill = async (studentId, skillData) => {
    const { skillName, skillLevel = null, category = null } = skillData;

    const result = await pool.query(
        `
        INSERT INTO student_skills
            (student_id, skill_name, skill_level, category, created_at, updated_at)
        VALUES
            ($1, $2, $3, $4, NOW(), NOW())
        ON CONFLICT (student_id, skill_name)
        DO UPDATE SET
            skill_level = EXCLUDED.skill_level,
            category    = EXCLUDED.category,
            updated_at  = NOW()
        RETURNING id, student_id, skill_name, skill_level, category, created_at, updated_at
        `,
        [studentId, skillName, skillLevel, category]
    );

    return toSkill(result.rows[0]);
};

/**
 * updateSkill
 * ────────────
 * Partially updates a skill by its id. Only passes provided fields.
 *
 * @param {number} skillId
 * @param {number} studentId   - Ownership guard (WHERE clause).
 * @param {object} skillData
 * @returns {Promise<object|null>}
 */
export const updateSkill = async (skillId, studentId, skillData) => {
    const mapping = {
        skillName:  'skill_name',
        skillLevel: 'skill_level',
        category:   'category',
    };

    const fields = [];
    const values = [];

    for (const [key, col] of Object.entries(mapping)) {
        if (skillData[key] !== undefined) {
            values.push(skillData[key]);
            fields.push(`${col} = $${values.length}`);
        }
    }

    if (fields.length === 0) {
        const current = await pool.query(
            `SELECT id, student_id, skill_name, skill_level, category, created_at, updated_at
             FROM student_skills WHERE id = $1 AND student_id = $2`,
            [skillId, studentId]
        );
        return current.rows[0] ? toSkill(current.rows[0]) : null;
    }

    values.push(skillId, studentId);
    const result = await pool.query(
        `
        UPDATE student_skills
        SET    ${fields.join(', ')}, updated_at = NOW()
        WHERE  id = $${values.length - 1} AND student_id = $${values.length}
        RETURNING id, student_id, skill_name, skill_level, category, created_at, updated_at
        `,
        values
    );

    return result.rows[0] ? toSkill(result.rows[0]) : null;
};

/**
 * deleteSkill
 * ────────────
 * Deletes a skill by id, ensuring it belongs to the given studentId.
 *
 * @param {number} skillId
 * @param {number} studentId
 * @returns {Promise<{ id: number }|null>}
 */
export const deleteSkill = async (skillId, studentId) => {
    const result = await pool.query(
        `
        DELETE FROM student_skills
        WHERE  id = $1 AND student_id = $2
        RETURNING id
        `,
        [skillId, studentId]
    );

    return result.rows[0] ?? null;
};

// ── CERTIFICATION QUERIES ─────────────────────────────────────────────────────

/**
 * getCertifications
 * ──────────────────
 * Returns all certifications for the given studentId, newest first.
 *
 * @param {number} studentId
 * @returns {Promise<object[]>}
 */
export const getCertifications = async (studentId) => {
    const result = await pool.query(
        `
        SELECT
            id, student_id, name, issuing_organization, issue_date,
            expiry_date, credential_id, credential_url, created_at, updated_at
        FROM   certifications
        WHERE  student_id = $1
        ORDER  BY issue_date DESC NULLS LAST, created_at DESC
        `,
        [studentId]
    );

    return result.rows.map(toCertification);
};

/**
 * addCertification
 * ─────────────────
 * Inserts a new certification record.
 *
 * @param {number} studentId
 * @param {object} certData
 * @returns {Promise<object>}
 */
export const addCertification = async (studentId, certData) => {
    const {
        name,
        issuingOrganization = null,
        issueDate           = null,
        expiryDate          = null,
        credentialId        = null,
        credentialUrl       = null,
    } = certData;

    const result = await pool.query(
        `
        INSERT INTO certifications
            (student_id, name, issuing_organization, issue_date,
             expiry_date, credential_id, credential_url, created_at, updated_at)
        VALUES
            ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING
            id, student_id, name, issuing_organization, issue_date,
            expiry_date, credential_id, credential_url, created_at, updated_at
        `,
        [studentId, name, issuingOrganization, issueDate, expiryDate, credentialId, credentialUrl]
    );

    return toCertification(result.rows[0]);
};

/**
 * deleteCertification
 * ────────────────────
 * Deletes a certification by id, ensuring ownership.
 *
 * @param {number} certId
 * @param {number} studentId
 * @returns {Promise<{ id: number }|null>}
 */
export const deleteCertification = async (certId, studentId) => {
    const result = await pool.query(
        `
        DELETE FROM certifications
        WHERE  id = $1 AND student_id = $2
        RETURNING id
        `,
        [certId, studentId]
    );

    return result.rows[0] ?? null;
};
