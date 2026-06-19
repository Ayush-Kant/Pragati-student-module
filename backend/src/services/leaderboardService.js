// ─────────────────────────────────────────────────────────────
//  leaderboardService.js
//  Dashboard Aggregation Engine — core service layer.
//
//  Responsibilities
//  ────────────────
//  • aggregateDashboard()  — parallel query aggregation + assembly
//  • Batch Rank            — via calculateBatchRank() util
//  • Percentile            — via calculatePercentile() util
//  • Hide Raw Readiness    — raw score stripped in serializeDashboard()
//  • Leaderboard Processing — ordered, ranked, isSelf-tagged entries
//  • Dashboard Serialization — safe, client-ready payload
// ─────────────────────────────────────────────────────────────

import { pool } from '../../config/db.js';
import {
    calculatePercentile,
    calculateBatchRank,
    injectIsSelf,
    serializeDashboard,
} from '../utils/dashboardUtils.js';

// ─── Internal Queries ────────────────────────────────────────

/**
 * Fetch the requesting user's own profile + raw readiness score.
 * `readiness_score` is stored as a raw NUMERIC in the DB and is
 * intentionally exposed only internally (stripped before response).
 */
const _fetchSelfProfile = async (userId) => {
    const result = await pool.query(
        `
        SELECT
            u.id                            AS "userId",
            u.full_name                     AS "fullName",
            u.email,
            s.branch,
            s.graduation_year               AS "graduationYear",
            s.college,
            s.profile_completeness          AS "profileCompleteness",
            s.readiness_score               AS "rawReadinessScore",
            ROUND(s.readiness_score, 1)     AS "readinessScore"
        FROM users u
        JOIN students s ON s.id = u.id
        WHERE u.uuid_id = $1
        `,
        [userId]
    );

    return result.rows[0] ?? null;
};

/**
 * Fetch leaderboard entries scoped to the same batch
 * (same college + graduation_year) as the requesting user.
 */
const _fetchBatchLeaderboard = async ({ college, graduationYear }) => {
    const result = await pool.query(
        `
        SELECT
            u.id                            AS "userId",
            u.uuid_id                       AS "userUuid",
            u.full_name                     AS "fullName",
            s.branch,
            s.profile_completeness          AS "profileCompleteness",
            s.readiness_score               AS "rawReadinessScore",
            ROUND(s.readiness_score, 1)     AS "readinessScore",

            -- Placement stage for the most recent drive the student joined
            (
                SELECT sdp.stage
                FROM student_drive_progress sdp
                WHERE sdp.student_id = s.id
                ORDER BY sdp.updated_at DESC
                LIMIT 1
            ) AS "latestStage"

        FROM users u
        JOIN students s ON s.id = u.id
        WHERE
            u.role = 'student'
            AND s.college = $1
            AND s.graduation_year = $2
        ORDER BY s.readiness_score DESC
        `,
        [college, graduationYear]
    );

    return result.rows;
};

/**
 * Fetch aggregate placement statistics for the batch.
 */
const _fetchBatchStats = async ({ college, graduationYear }) => {
    const result = await pool.query(
        `
        SELECT
            COUNT(DISTINCT u.id)                                            AS "totalStudents",
            COUNT(DISTINCT sdp.student_id)
                FILTER (WHERE sdp.stage = 'selected')                      AS "totalSelected",
            COUNT(DISTINCT sdp.drive_id)                                    AS "totalDrives",
            ROUND(AVG(s.readiness_score), 1)                               AS "avgReadinessScore",
            ROUND(
                100.0 *
                COUNT(DISTINCT sdp.student_id) FILTER (WHERE sdp.stage = 'selected')
                / NULLIF(COUNT(DISTINCT u.id), 0),
                1
            )                                                               AS "selectionRate"
        FROM users u
        JOIN students s ON s.id = u.id
        LEFT JOIN student_drive_progress sdp ON sdp.student_id = s.id
        WHERE
            u.role = 'student'
            AND s.college = $1
            AND s.graduation_year = $2
        `,
        [college, graduationYear]
    );

    const row = result.rows[0];
    return {
        totalStudents   : parseInt(row.totalStudents)    || 0,
        totalSelected   : parseInt(row.totalSelected)    || 0,
        totalDrives     : parseInt(row.totalDrives)      || 0,
        avgReadinessScore: Number(row.avgReadinessScore) || 0,
        selectionRate   : Number(row.selectionRate)      || 0,
    };
};

/**
 * Fetch the 5 most recently active recruitment drives the student
 * has participated in (for the "My Drives" widget).
 */
const _fetchStudentDrives = async (studentId) => {
    const result = await pool.query(
        `
        SELECT
            rd.id       AS "driveId",
            rd.title,
            rd.status,
            c.name      AS "companyName",
            sdp.stage,
            sdp.updated_at AS "updatedAt"
        FROM student_drive_progress sdp
        JOIN recruitment_drives rd ON rd.id = sdp.drive_id
        JOIN companies c           ON c.id  = rd.company_id
        WHERE sdp.student_id = $1
        ORDER BY sdp.updated_at DESC
        LIMIT 5
        `,
        [studentId]
    );

    return result.rows.map((row) => ({
        driveId    : row.driveId,
        title      : row.title,
        status     : row.status,
        companyName: row.companyName,
        stage      : row.stage,
        updatedAt  : row.updatedAt,
    }));
};

// ─── Public API ──────────────────────────────────────────────

/**
 * aggregateDashboard
 * ------------------
 * Orchestrates all DB queries in parallel, computes derived
 * metrics (percentile, batch rank, isSelf tags), then returns
 * a fully assembled, serialized dashboard payload.
 *
 * @param {string} requestingUserId - UUID of the logged-in student.
 * @returns {Promise<Object>} Serialized dashboard object.
 *
 * @throws {Error} If the requesting user does not exist.
 */
const aggregateDashboard = async (requestingUserId) => {

    // ── 1. Fetch self-profile first (needed for batch scope) ──
    const self = await _fetchSelfProfile(requestingUserId);

    if (!self) {
        throw new Error(`Student profile not found for userId: ${requestingUserId}`);
    }

    const batchScope = {
        college       : self.college,
        graduationYear: self.graduationYear,
    };

    // ── 2. Parallel aggregation ───────────────────────────────
    const [leaderboard, batchStats, studentDrives] = await Promise.all([
        _fetchBatchLeaderboard(batchScope),
        _fetchBatchStats(batchScope),
        _fetchStudentDrives(self.userId),
    ]);

    // ── 3. Batch rank (mutates entries in-place) ─────────────
    calculateBatchRank(leaderboard, 'readinessScore');

    // ── 4. Percentile for the requesting user ────────────────
    const allScores = leaderboard.map((e) => Number(e.rawReadinessScore) || 0);
    const selfEntry = leaderboard.find((e) => e.userId === self.userId);

    const percentile = calculatePercentile(
        Number(self.rawReadinessScore) || 0,
        allScores
    );

    // ── 5. isSelf injection ───────────────────────────────────
    injectIsSelf(leaderboard, self.userId, 'userId');

    // ── 6. Assemble raw dashboard ─────────────────────────────
    const raw = {
        self: {
            ...self,
            percentile,
            batchRank: selfEntry?.batchRank ?? null,
        },
        batchStats,
        leaderboard,
        drives: studentDrives,
        generatedAt: new Date().toISOString(),
    };

    // ── 7. Serialize (strip rawReadinessScore, coerce numerics) ──
    return {
        self       : serializeDashboard(raw.self),
        batchStats : serializeDashboard(raw.batchStats),
        leaderboard: serializeDashboard(raw.leaderboard),
        drives     : raw.drives,
        generatedAt: raw.generatedAt,
    };
};

export {
    aggregateDashboard,
    // Re-exported so controllers/tests can use them independently
    calculatePercentile,
    calculateBatchRank,
    injectIsSelf,
    serializeDashboard,
};
