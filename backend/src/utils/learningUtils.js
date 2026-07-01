// ─────────────────────────────────────────────────────────────
//  learningUtils.js
//  Pure utility helpers for the Learning Engine.
//  No DB access here — all functions are deterministic and
//  operate only on the in-memory data passed to them.
//
//  Student identity resolution (uuid → students.id) and all
//  JOIN logic live in progressService.js, not here.
// ─────────────────────────────────────────────────────────────

/** Threshold (0–1) at which watch-time auto-qualifies as complete. */
const COMPLETION_THRESHOLD = 0.9;

/**
 * calculateWatchPercentage
 * ------------------------
 * Returns the percentage (0–100) of a lesson's duration that
 * the student has watched.
 *
 * Guards:
 *  - Returns 0 when `durationSeconds` is null, undefined, or ≤ 0.
 *  - Caps the result at 100 (watch_seconds may overshoot duration
 *    due to seeks / replays).
 *
 * @param {number|null} watchSeconds    - Seconds the student has watched.
 * @param {number|null} durationSeconds - Total lesson duration in seconds.
 * @returns {number} Watch percentage rounded to one decimal place.
 *
 * @example
 *   calculateWatchPercentage(270, 300)  // → 90.0
 *   calculateWatchPercentage(null, 300) // → 0
 *   calculateWatchPercentage(350, 300)  // → 100  (capped)
 */
const calculateWatchPercentage = (watchSeconds, durationSeconds) => {
    const watched  = Number(watchSeconds)    || 0;
    const duration = Number(durationSeconds) || 0;

    if (duration <= 0) return 0;

    const raw = Math.min((watched / duration) * 100, 100);
    return Number(raw.toFixed(1));
};

/**
 * calculateLessonCompletion
 * -------------------------
 * Summarises how many lessons in a given set have been completed.
 *
 * A lesson counts as "completed" when its `status` field equals
 * `'completed'`.
 *
 * @param {Object[]} lessonProgressRows - Array of lesson-progress records.
 *        Each must have at least `{ status: string }`.
 * @returns {{ completed: number, total: number, percentage: number }}
 *
 * @example
 *   calculateLessonCompletion([
 *     { status: 'completed' },
 *     { status: 'in_progress' },
 *     { status: 'not_started' },
 *   ])
 *   // → { completed: 1, total: 3, percentage: 33.3 }
 */
const calculateLessonCompletion = (lessonProgressRows) => {
    if (!Array.isArray(lessonProgressRows) || lessonProgressRows.length === 0) {
        return { completed: 0, total: 0, percentage: 0 };
    }

    const total     = lessonProgressRows.length;
    const completed = lessonProgressRows.filter((r) => r.status === 'completed').length;
    const percentage = total > 0 ? Number(((completed / total) * 100).toFixed(1)) : 0;

    return { completed, total, percentage };
};

/**
 * calculateModuleProgress
 * -----------------------
 * Computes completion progress for a single module by cross-referencing
 * its lessons against a progress lookup map.
 *
 * Lessons that have no matching entry in `lessonProgressMap` are
 * treated as `not_started`.
 *
 * @param {{ moduleId: number, lessons: Object[] }} moduleDef
 *        The module definition including its `lessons` array.
 *        Each lesson must have at least `{ lessonId: number }`.
 * @param {Map<number, Object>} lessonProgressMap
 *        Map keyed by `lessonId` → progress record with `{ status }`.
 * @returns {{ moduleId: number, completed: number, total: number, percentage: number }}
 *
 * @example
 *   const mod = { moduleId: 1, lessons: [{ lessonId: 10 }, { lessonId: 11 }] };
 *   const map = new Map([[10, { status: 'completed' }]]);
 *   calculateModuleProgress(mod, map)
 *   // → { moduleId: 1, completed: 1, total: 2, percentage: 50.0 }
 */
const calculateModuleProgress = (moduleDef, lessonProgressMap) => {
    const lessons = moduleDef?.lessons ?? [];
    const moduleId = moduleDef?.moduleId ?? null;

    if (lessons.length === 0) {
        return { moduleId, completed: 0, total: 0, percentage: 0 };
    }

    // Build an effective progress row for each lesson
    const effectiveRows = lessons.map((lesson) => {
        const progress = lessonProgressMap.get(lesson.lessonId);
        return progress ?? { status: 'not_started' };
    });

    const { completed, total, percentage } = calculateLessonCompletion(effectiveRows);
    return { moduleId, completed, total, percentage };
};

/**
 * calculateCourseProgress
 * -----------------------
 * Aggregates an array of per-module progress objects into a single
 * course-level completion summary.
 *
 * @param {{ completed: number, total: number }[]} moduleProgressArray
 *        Output of `calculateModuleProgress()` for each module.
 * @returns {{ completed: number, total: number, percentage: number }}
 *
 * @example
 *   calculateCourseProgress([
 *     { completed: 3, total: 5, percentage: 60 },
 *     { completed: 2, total: 2, percentage: 100 },
 *   ])
 *   // → { completed: 5, total: 7, percentage: 71.4 }
 */
const calculateCourseProgress = (moduleProgressArray) => {
    if (!Array.isArray(moduleProgressArray) || moduleProgressArray.length === 0) {
        return { completed: 0, total: 0, percentage: 0 };
    }

    const completed = moduleProgressArray.reduce((sum, m) => sum + (m.completed || 0), 0);
    const total     = moduleProgressArray.reduce((sum, m) => sum + (m.total || 0), 0);
    const percentage = total > 0 ? Number(((completed / total) * 100).toFixed(1)) : 0;

    return { completed, total, percentage };
};

/**
 * calculateContinueLearning
 * -------------------------
 * Picks the best "continue learning" entries across all enrolled
 * courses.  Returns the most-recently-accessed **in-progress** lessons,
 * capped at `limit` entries, sorted by `lastAccessedAt` descending.
 *
 * Each `course` in the input must carry its resolved module → lesson
 * tree **and** a progress map so the function can locate in-progress
 * lessons and attach context (course title, module title, watch %).
 *
 * @param {Object[]} enrichedCourses - Array of course objects shaped:
 *   ```
 *   {
 *     courseId, courseTitle,
 *     modules: [{ moduleId, moduleTitle, lessons: [{ lessonId, title, contentType, durationSeconds }] }],
 *   }
 *   ```
 * @param {Map<number, Object>} progressMap - Map<lessonId, progressRow>.
 *        Each row: `{ status, watchSeconds, lastAccessedAt }`.
 * @param {number} [limit=5] - Maximum entries to return.
 * @returns {Object[]} Sorted continue-learning entries.
 *
 * @example
 *   calculateContinueLearning(courses, progressMap)
 *   // → [{ courseId, courseTitle, lessonId, lessonTitle, moduleTitle,
 *   //       watchPercentage, lastAccessedAt }, …]
 */
const calculateContinueLearning = (enrichedCourses, progressMap, limit = 5) => {
    if (!Array.isArray(enrichedCourses) || !progressMap) return [];

    const candidates = [];

    for (const course of enrichedCourses) {
        const modules = course.modules ?? [];

        for (const mod of modules) {
            const lessons = mod.lessons ?? [];

            for (const lesson of lessons) {
                const progress = progressMap.get(lesson.lessonId);

                if (progress && progress.status === 'in_progress') {
                    candidates.push({
                        courseId       : course.courseId,
                        courseTitle    : course.courseTitle,
                        moduleTitle   : mod.moduleTitle,
                        lessonId      : lesson.lessonId,
                        lessonTitle   : lesson.title,
                        contentType   : lesson.contentType,
                        watchPercentage: calculateWatchPercentage(
                            progress.watchSeconds,
                            lesson.durationSeconds,
                        ),
                        lastAccessedAt: progress.lastAccessedAt ?? null,
                    });
                }
            }
        }
    }

    // Sort most-recently-accessed first, nulls last
    candidates.sort((a, b) => {
        const aTime = a.lastAccessedAt ? new Date(a.lastAccessedAt).getTime() : 0;
        const bTime = b.lastAccessedAt ? new Date(b.lastAccessedAt).getTime() : 0;
        return bTime - aTime;
    });

    return candidates.slice(0, limit);
};

/**
 * serializeLearningData
 * ---------------------
 * Strips or transforms sensitive / internal fields before the
 * learning payload is sent to the client.
 *
 * Rules applied:
 *  - `password_hash`, `passwordHash`, `password` are removed
 *    (defensive guard).
 *  - Numeric fields relevant to the learning domain are coerced
 *    to JS numbers (guards against PostgreSQL returning numeric
 *    strings for NUMERIC / BIGINT columns).
 *
 * @param {Object|Object[]} data - Single record or array of records.
 * @returns {Object|Object[]} Sanitised copy (shallow-cloned).
 *
 * @example
 *   serializeLearningData({ watchPercentage: '91.5', password_hash: 'x' })
 *   // → { watchPercentage: 91.5 }
 */
const serializeLearningData = (data) => {
    const STRIP_FIELDS = ['password_hash', 'passwordHash', 'password'];

    const NUMERIC_FIELDS = [
        'watchPercentage',
        'completionPercentage',
        'percentage',
        'totalDuration',
        'watchSeconds',
        'durationSeconds',
        'completed',
        'total',
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
    COMPLETION_THRESHOLD,
    calculateWatchPercentage,
    calculateLessonCompletion,
    calculateModuleProgress,
    calculateCourseProgress,
    calculateContinueLearning,
    serializeLearningData,
};
