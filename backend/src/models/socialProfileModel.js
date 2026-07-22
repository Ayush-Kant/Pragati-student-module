// ─────────────────────────────────────────────────────────────────────────────
//  socialProfileModel.js
//  Data access layer for the student_social_links table.
//
//  Functions:
//    • getSocialProfiles()    — fetch social links for a student
//    • updateSocialProfiles() — upsert social links
// ─────────────────────────────────────────────────────────────────────────────

import { pool } from '../../config/db.js';

// ── Row Mapper ────────────────────────────────────────────────────────────────

const toSocialProfile = (row) => ({
    id:           row.id,
    studentId:    row.student_id,
    linkedinUrl:  row.linkedin_url,
    githubUrl:    row.github_url,
    portfolioUrl: row.portfolio_url,
    twitterUrl:   row.twitter_url,
    websiteUrl:   row.website_url,
    createdAt:    row.created_at,
    updatedAt:    row.updated_at,
});

// ── Queries ───────────────────────────────────────────────────────────────────

/**
 * getSocialProfiles
 * ──────────────────
 * Returns the social links record for the given studentId.
 * Returns a zeroed object (all null URLs) if no record exists yet.
 *
 * @param {number} studentId
 * @returns {Promise<object>}
 */
export const getSocialProfiles = async (studentId) => {
    const result = await pool.query(
        `
        SELECT
            id, student_id, linkedin_url, github_url,
            portfolio_url, twitter_url, website_url,
            created_at, updated_at
        FROM   student_social_links
        WHERE  student_id = $1
        `,
        [studentId]
    );

    if (result.rows[0]) {
        return toSocialProfile(result.rows[0]);
    }

    // Return empty shape so the frontend always has a consistent structure
    return {
        id:           null,
        studentId:    studentId,
        linkedinUrl:  null,
        githubUrl:    null,
        portfolioUrl: null,
        twitterUrl:   null,
        websiteUrl:   null,
        createdAt:    null,
        updatedAt:    null,
    };
};

/**
 * updateSocialProfiles
 * ─────────────────────
 * Upserts the social links record for the given studentId.
 * Only fields present in socialData are written; others retain their
 * current values via COALESCE.
 *
 * @param {number} studentId
 * @param {object} socialData
 * @returns {Promise<object>}
 */
export const updateSocialProfiles = async (studentId, socialData) => {
    const {
        linkedinUrl  = null,
        githubUrl    = null,
        portfolioUrl = null,
        twitterUrl   = null,
        websiteUrl   = null,
    } = socialData;

    const result = await pool.query(
        `
        INSERT INTO student_social_links
            (student_id, linkedin_url, github_url, portfolio_url,
             twitter_url, website_url, created_at, updated_at)
        VALUES
            ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        ON CONFLICT (student_id)
        DO UPDATE SET
            linkedin_url  = COALESCE($2, student_social_links.linkedin_url),
            github_url    = COALESCE($3, student_social_links.github_url),
            portfolio_url = COALESCE($4, student_social_links.portfolio_url),
            twitter_url   = COALESCE($5, student_social_links.twitter_url),
            website_url   = COALESCE($6, student_social_links.website_url),
            updated_at    = NOW()
        RETURNING
            id, student_id, linkedin_url, github_url,
            portfolio_url, twitter_url, website_url,
            created_at, updated_at
        `,
        [studentId, linkedinUrl, githubUrl, portfolioUrl, twitterUrl, websiteUrl]
    );

    return toSocialProfile(result.rows[0]);
};
