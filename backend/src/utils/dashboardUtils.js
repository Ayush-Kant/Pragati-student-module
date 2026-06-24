// ─────────────────────────────────────────────────────────────
//  dashboardUtils.js
//  Pure utility helpers for the Dashboard Aggregation Engine.
//  No DB access here — all functions are deterministic and
//  operate only on the in-memory data passed to them.
// ─────────────────────────────────────────────────────────────

/**
 * calculatePercentile
 * -------------------
 * Returns the percentile rank (0–100) of `score` within the
 * given `scores` array.  Uses the standard "percentage of values
 * below *or equal*" formula:
 *
 *     percentile = ((below + 0.5 × equal) / total) × 100
 *
 * This matches common HR / academic usage where tied scores
 * share the midpoint of the ranks they would span.
 *
 * @param {number}   score  - The individual's score to rank.
 * @param {number[]} scores - All scores in the cohort (unsorted).
 * @returns {number} Percentile rounded to one decimal place.
 *
 * @example
 *   calculatePercentile(75, [50, 60, 75, 80, 90])  // → 50.0
 */
const calculatePercentile = (score, scores) => {
    if (!Array.isArray(scores) || scores.length === 0) return 0;

    const below = scores.filter((s) => s < score).length;
    const equal = scores.filter((s) => s === score).length;
    const raw   = ((below + 0.5 * equal) / scores.length) * 100;

    return Number(raw.toFixed(1));
};

/**
 * calculateBatchRank
 * ------------------
 * Returns a **new** array of shallow-cloned entries, each augmented
 * with a 1-based `batchRank` computed from `scoreKey` (descending).
 * Ties receive the same rank and the next rank is skipped
 * (standard competition ranking: 1, 1, 3…).
 *
 * The original `entries` array is **not** mutated.
 *
 * @param {Object[]} entries   - Array of student/entry objects.
 * @param {string}   scoreKey  - Property name to rank by.
 * @returns {Object[]} A new array with `batchRank` set on each entry.
 *
 * @example
 *   calculateBatchRank([{ score: 90 }, { score: 70 }, { score: 90 }], 'score')
 *   // → [{ score: 90, batchRank: 1 }, { score: 70, batchRank: 3 }, { score: 90, batchRank: 1 }]
 */
const calculateBatchRank = (entries, scoreKey = 'readinessScore') => {
    if (!Array.isArray(entries) || entries.length === 0) return [];

    // Clone entries to avoid mutating the originals
    const cloned = entries.map((e) => ({ ...e }));

    // Sort descending by scoreKey
    const sorted = [...cloned].sort((a, b) => (b[scoreKey] ?? 0) - (a[scoreKey] ?? 0));

    // Assign competition ranks
    let rank = 1;
    for (let i = 0; i < sorted.length; i++) {
        if (i > 0 && (sorted[i][scoreKey] ?? 0) < (sorted[i - 1][scoreKey] ?? 0)) {
            rank = i + 1;
        }
        sorted[i].batchRank = rank;
    }

    // Map ranks back onto the cloned array (preserving original order)
    const rankMap = new Map(sorted.map((e, idx) => [idx, e.batchRank]));
    const sortedIndexMap = new Map(sorted.map((e, idx) => [e, idx]));
    cloned.forEach((e) => {
        const sortedIdx = sortedIndexMap.get(e);
        e.batchRank = sortedIdx !== undefined ? rankMap.get(sortedIdx) : null;
    });

    return cloned;
};

/**
 * injectIsSelf
 * ------------
 * Marks the entry whose `idField` matches `requestingUserId`
 * with `isSelf: true`. All other entries get `isSelf: false`.
 * Useful for the frontend to highlight the requesting user's
 * own row in a leaderboard without exposing who else is who.
 *
 * @param {Object[]} entries          - Leaderboard entry objects.
 * @param {string}   requestingUserId - UUID of the logged-in user.
 * @param {string}   [idField='userId'] - Property that holds each entry's user id.
 * @returns {Object[]} Same array, mutated in-place.
 */
const injectIsSelf = (entries, requestingUserId, idField = 'userId') => {
    if (!Array.isArray(entries)) return entries;

    entries.forEach((entry) => {
        entry.isSelf = String(entry[idField]) === String(requestingUserId);
    });

    return entries;
};

/**
 * serializeDashboard
 * ------------------
 * Strips or transforms sensitive fields before the dashboard
 * payload is sent to the client.
 *
 * Rules applied:
 *  - `rawReadinessScore` is removed (replaced by the public
 *    `readinessScore` already rounded / bucketed upstream).
 *  - `password_hash`, `passwordHash`, `password` are removed
 *    (defensive guard — should never reach here, but just in case).
 *  - Numeric fields are coerced to JS numbers (guards against
 *    PostgreSQL returning numeric strings for NUMERIC columns).
 *
 * @param {Object|Object[]} data - Single record or array of records.
 * @returns {Object|Object[]} Sanitised copy (deep-cloned).
 */
const serializeDashboard = (data) => {
    const STRIP_FIELDS    = ['rawReadinessScore', 'password_hash', 'passwordHash', 'password'];
    const NUMERIC_FIELDS  = [
        'readinessScore',
        'percentile',
        'batchRank',
        'profileCompleteness',
        'selectionRate',
        'participationRate',
        'engagementScore',
    ];

    const sanitize = (record) => {
        if (record === null || typeof record !== 'object') return record;

        const out = { ...record };

        // Remove sensitive fields
        STRIP_FIELDS.forEach((field) => {
            delete out[field];
        });

        // Coerce numeric-string fields returned by pg
        NUMERIC_FIELDS.forEach((field) => {
            if (out[field] !== undefined && out[field] !== null) {
                out[field] = Number(out[field]);
            }
        });

        return out;
    };

    return Array.isArray(data) ? data.map(sanitize) : sanitize(data);
};

export {
    calculatePercentile,
    calculateBatchRank,
    injectIsSelf,
    serializeDashboard,
};
