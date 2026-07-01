// ─────────────────────────────────────────────────────────────
//  progressService.js
//  Learning Engine — core service layer.
//
//  Responsibilities
//  ────────────────
//  • aggregateLearningDashboard() — parallel query aggregation + assembly
//  • Progress Aggregation         — per-lesson, per-module, per-course
//  • Continue Learning Engine     — most-recently-accessed in-progress lessons
//  • Course Completion Logic      — via learningUtils calculators
//  • Learning Serialization       — safe, client-ready payload
//  • Dashboard Aggregation        — fully assembled learning dashboard
// ─────────────────────────────────────────────────────────────

import { pool } from '../../config/db.js';
import {
    calculateWatchPercentage,
    calculateModuleProgress,
    calculateCourseProgress,
    calculateContinueLearning,
    serializeLearningData,
} from '../utils/learningUtils.js';

// ─── Internal Queries ────────────────────────────────────────

/**
 * _resolveStudentId
 * -----------------
 * Resolves a user's auth UUID (`auth_users.uuid_id`) to their integer
 * student PK (`students.id`) and display name.
 *
 * Join strategy
 * ─────────────
 * The `students` table has no `user_id` FK column (confirmed from schema).
 * The safest available link between the two systems is the `email` field,
 * which is declared UNIQUE NOT NULL in both `auth_users` and `students`.
 *
 * Resolution chain:
 *   auth_users  (uuid_id = $1)
 *     → users        (users.auth_user_id = auth_users.id)
 *     → students     (students.email    = auth_users.email)
 *
 * @param {string} uuidId - The `uuid_id` from the `auth_users` table.
 * @returns {Promise<{ studentId: number, fullName: string } | null>}
 */
const _resolveStudentId = async (uuidId) => {
    try {
        const result = await pool.query(
            `
            SELECT
                s.id        AS "studentId",
                s.full_name AS "fullName"
            FROM auth_users au
            -- Link auth identity to the profile record via auth_user_id
            JOIN users u ON u.auth_user_id = au.id
            -- Link profile to the students record via the shared UNIQUE email
            -- (students has no user_id FK; email is the reliable common key)
            JOIN students s ON s.email = au.email
            WHERE au.uuid_id = $1
            `,
            [uuidId]
        );

        return result.rows[0] ?? null;
    } catch (err) {
        console.error('[progressService] _resolveStudentId failed:', err);
        throw err;
    }
};

/**
 * _fetchEnrolledCourses
 * ---------------------
 * Returns all courses a student is enrolled in, together with
 * the enrollment timestamp.
 *
 * Only returns courses with status = 'published' (students should
 * not see draft / archived courses in their learning dashboard).
 *
 * @param {number} studentId - Integer PK from `students` table.
 * @returns {Promise<Object[]>} Array of enrolled-course rows.
 */
const _fetchEnrolledCourses = async (studentId) => {
    try {
        const result = await pool.query(
            `
            SELECT
                c.id            AS "courseId",
                c.title         AS "courseTitle",
                c.skill_tags    AS "skillTags",
                c.status,
                sce.enrolled_at AS "enrolledAt"
            FROM student_course_enrollments sce
            JOIN courses c ON c.id = sce.course_id
            WHERE sce.student_id = $1
              AND c.status = 'published'
            ORDER BY sce.enrolled_at DESC
            `,
            [studentId]
        );

        return result.rows;
    } catch (err) {
        console.error('[progressService] _fetchEnrolledCourses failed:', err);
        throw err;
    }
};

/**
 * _fetchLessonProgress
 * --------------------
 * Fetches every `student_lesson_progress` row for the given student
 * in a single query.  The caller builds a Map<lessonId, row> from
 * the result for O(1) lookups.
 *
 * @param {number} studentId - Integer PK from `students` table.
 * @returns {Promise<Object[]>} Raw progress rows.
 */
const _fetchLessonProgress = async (studentId) => {
    try {
        const result = await pool.query(
            `
            SELECT
                slp.lesson_id       AS "lessonId",
                slp.status,
                slp.watch_seconds   AS "watchSeconds",
                slp.completed_at    AS "completedAt",
                slp.last_accessed_at AS "lastAccessedAt"
            FROM student_lesson_progress slp
            WHERE slp.student_id = $1
            `,
            [studentId]
        );

        return result.rows;
    } catch (err) {
        console.error('[progressService] _fetchLessonProgress failed:', err);
        throw err;
    }
};

/**
 * _fetchCourseStructure
 * ---------------------
 * Fetches the full course → module → lesson tree for one or more
 * courses in a single query.  Returns flat rows that the caller
 * reshapes into a nested structure.
 *
 * @param {number[]} courseIds - Array of course PKs.
 * @returns {Promise<Object[]>} Flat rows with course, module, and lesson data.
 */
const _fetchCourseStructure = async (courseIds) => {
    if (!Array.isArray(courseIds) || courseIds.length === 0) return [];

    try {
        const result = await pool.query(
            `
            SELECT
                c.id                AS "courseId",
                m.id                AS "moduleId",
                m.title             AS "moduleTitle",
                m.order_index       AS "moduleOrder",
                l.id                AS "lessonId",
                l.title             AS "lessonTitle",
                l.content_type      AS "contentType",
                l.duration_seconds  AS "durationSeconds",
                l.order_index       AS "lessonOrder"
            FROM courses c
            JOIN modules m ON m.course_id = c.id
            LEFT JOIN lessons l ON l.module_id = m.id
            WHERE c.id = ANY($1)
            ORDER BY c.id, m.order_index, l.order_index
            `,
            [courseIds]
        );

        return result.rows;
    } catch (err) {
        console.error('[progressService] _fetchCourseStructure failed:', err);
        throw err;
    }
};

// ─── Helpers ─────────────────────────────────────────────────

/**
 * _buildCourseTree
 * ----------------
 * Reshapes the flat rows from `_fetchCourseStructure` into a nested
 * course → module → lesson tree.
 *
 * @param {Object[]} flatRows - Rows from `_fetchCourseStructure`.
 * @param {Object[]} enrolledCourses - Enrolled course metadata (for titles, tags).
 * @returns {Object[]} Nested course objects.
 */
const _buildCourseTree = (flatRows, enrolledCourses) => {
    // Metadata lookup for enrolled courses
    const enrollmentMap = new Map(
        enrolledCourses.map((ec) => [ec.courseId, ec])
    );

    // Accumulator: courseId → { ...meta, modules: Map<moduleId, { ...meta, lessons: [] }> }
    const courseMap = new Map();

    for (const row of flatRows) {
        // Initialise course bucket
        if (!courseMap.has(row.courseId)) {
            const meta = enrollmentMap.get(row.courseId) ?? {};
            courseMap.set(row.courseId, {
                courseId   : row.courseId,
                courseTitle: meta.courseTitle ?? '',
                skillTags : meta.skillTags ?? [],
                status    : meta.status ?? 'published',
                enrolledAt: meta.enrolledAt ?? null,
                modules   : new Map(),
            });
        }

        const course = courseMap.get(row.courseId);

        // Initialise module bucket
        if (row.moduleId && !course.modules.has(row.moduleId)) {
            course.modules.set(row.moduleId, {
                moduleId   : row.moduleId,
                moduleTitle: row.moduleTitle,
                orderIndex : row.moduleOrder,
                lessons    : [],
            });
        }

        // Add lesson (LEFT JOIN may yield null lessonId for empty modules)
        if (row.lessonId && course.modules.has(row.moduleId)) {
            course.modules.get(row.moduleId).lessons.push({
                lessonId       : row.lessonId,
                title          : row.lessonTitle,
                contentType    : row.contentType,
                durationSeconds: Number(row.durationSeconds) || 0,
                orderIndex     : row.lessonOrder,
            });
        }
    }

    // Convert inner Maps to arrays
    return Array.from(courseMap.values()).map((course) => ({
        ...course,
        modules: Array.from(course.modules.values()),
    }));
};

// ─── Public API ──────────────────────────────────────────────

/**
 * aggregateLearningDashboard
 * --------------------------
 * Orchestrates all DB queries, computes per-module and per-course
 * completion, builds the "continue learning" widget, then returns
 * a fully assembled, serialized learning dashboard payload.
 *
 * @param {string} requestingUserId - UUID of the logged-in student
 *        (`auth_users.uuid_id`).
 * @returns {Promise<Object>} Serialized learning dashboard object.
 *
 * @throws {Error} If the requesting user does not exist or has no
 *         student profile.
 */
const aggregateLearningDashboard = async (requestingUserId) => {

    // ── 0. Input validation ───────────────────────────────────
    if (!requestingUserId || typeof requestingUserId !== 'string') {
        throw new Error(
            'aggregateLearningDashboard requires a valid requestingUserId (non-empty string).'
        );
    }

    // ── 1. Resolve student identity ───────────────────────────
    const student = await _resolveStudentId(requestingUserId);

    if (!student) {
        throw new Error(`Student profile not found for userId: ${requestingUserId}`);
    }

    const { studentId } = student;

    // ── 2. Fetch enrolled courses ─────────────────────────────
    const enrolledCourses = await _fetchEnrolledCourses(studentId);

    if (enrolledCourses.length === 0) {
        // No enrollments — return an empty but valid dashboard
        return {
            courses         : [],
            continueLearning: [],
            summary         : { totalCourses: 0, totalCompleted: 0, overallPercentage: 0 },
            generatedAt     : new Date().toISOString(),
        };
    }

    const courseIds = enrolledCourses.map((c) => c.courseId);

    // ── 3. Parallel aggregation ───────────────────────────────
    const [lessonProgressRows, structureRows] = await Promise.all([
        _fetchLessonProgress(studentId),
        _fetchCourseStructure(courseIds),
    ]);

    // ── 4. Build lookup structures ────────────────────────────
    const progressMap = new Map(
        lessonProgressRows.map((row) => [row.lessonId, row])
    );

    const courseTree = _buildCourseTree(structureRows, enrolledCourses);

    // ── 5. Compute progress per course ────────────────────────
    const coursesWithProgress = courseTree.map((course) => {
        // Per-module progress
        const moduleProgressArray = course.modules.map((mod) =>
            calculateModuleProgress(
                { moduleId: mod.moduleId, lessons: mod.lessons },
                progressMap,
            )
        );

        // Course-level rollup
        const courseProgress = calculateCourseProgress(moduleProgressArray);

        // Enrich modules with progress + per-lesson watch %
        const enrichedModules = course.modules.map((mod, idx) => ({
            moduleId  : mod.moduleId,
            title     : mod.moduleTitle,
            orderIndex: mod.orderIndex,
            progress  : moduleProgressArray[idx],
            lessons   : mod.lessons.map((lesson) => {
                const lp = progressMap.get(lesson.lessonId);
                return {
                    lessonId       : lesson.lessonId,
                    title          : lesson.title,
                    contentType    : lesson.contentType,
                    durationSeconds: lesson.durationSeconds,
                    watchPercentage: lp
                        ? calculateWatchPercentage(lp.watchSeconds, lesson.durationSeconds)
                        : 0,
                    status: lp?.status ?? 'not_started',
                };
            }),
        }));

        return {
            courseId  : course.courseId,
            title     : course.courseTitle,
            skillTags : course.skillTags,
            status    : course.status,
            enrolledAt: course.enrolledAt,
            progress  : courseProgress,
            modules   : enrichedModules,
        };
    });

    // ── 6. Continue Learning widget ───────────────────────────
    const continueLearning = calculateContinueLearning(courseTree, progressMap);

    // ── 7. Summary stats ──────────────────────────────────────
    const totalCourses   = coursesWithProgress.length;
    const totalCompleted = coursesWithProgress.filter(
        (c) => c.progress.total > 0 && c.progress.completed === c.progress.total
    ).length;
    const overallLessonsCompleted = coursesWithProgress.reduce(
        (sum, c) => sum + c.progress.completed, 0
    );
    const overallLessonsTotal = coursesWithProgress.reduce(
        (sum, c) => sum + c.progress.total, 0
    );
    const overallPercentage = overallLessonsTotal > 0
        ? Number(((overallLessonsCompleted / overallLessonsTotal) * 100).toFixed(1))
        : 0;

    // ── 8. Assemble & serialize ───────────────────────────────
    return {
        courses         : serializeLearningData(coursesWithProgress),
        continueLearning: serializeLearningData(continueLearning),
        summary         : serializeLearningData({
            totalCourses,
            totalCompleted,
            overallPercentage,
        }),
        generatedAt: new Date().toISOString(),
    };
};

export {
    aggregateLearningDashboard,
    // Re-exported so controllers/tests can use them independently
    calculateWatchPercentage,
    calculateModuleProgress,
    calculateCourseProgress,
    calculateContinueLearning,
    serializeLearningData,
};
