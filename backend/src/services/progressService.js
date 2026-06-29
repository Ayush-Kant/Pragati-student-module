// Merged progressService: combines training progress APIs with learning dashboard
// Keep both simple model delegations and the richer dashboard aggregation

import { pool } from '../../config/db.js';
import * as progressModel from "../models/progressModel.js";
import {
    calculateWatchPercentage,
    calculateModuleProgress,
    calculateCourseProgress,
    calculateContinueLearning,
    serializeLearningData,
} from '../utils/learningUtils.js';

// ---------------- Internal DB helpers (used by the dashboard engine) ----------------
const _resolveStudentId = async (uuidId) => {
    try {
        const result = await pool.query(
            `
            SELECT
                s.id        AS "studentId",
                COALESCE(u.full_name, s.full_name) AS "fullName"
            FROM auth_users au
            JOIN users u ON u.auth_user_id = au.id
            LEFT JOIN students s ON s.email = au.email
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

const _buildCourseTree = (flatRows, enrolledCourses) => {
    const enrollmentMap = new Map(enrolledCourses.map((ec) => [ec.courseId, ec]));
    const courseMap = new Map();

    for (const row of flatRows) {
        if (!courseMap.has(row.courseId)) {
            const meta = enrollmentMap.get(row.courseId) ?? {};
            courseMap.set(row.courseId, {
                courseId: row.courseId,
                courseTitle: meta.courseTitle ?? '',
                skillTags: meta.skillTags ?? [],
                status: meta.status ?? 'published',
                enrolledAt: meta.enrolledAt ?? null,
                modules: new Map(),
            });
        }

        const course = courseMap.get(row.courseId);
        if (row.moduleId && !course.modules.has(row.moduleId)) {
            course.modules.set(row.moduleId, {
                moduleId: row.moduleId,
                moduleTitle: row.moduleTitle,
                orderIndex: row.moduleOrder,
                lessons: [],
            });
        }

        if (row.lessonId && course.modules.has(row.moduleId)) {
            course.modules.get(row.moduleId).lessons.push({
                lessonId: row.lessonId,
                title: row.lessonTitle,
                contentType: row.contentType,
                durationSeconds: Number(row.durationSeconds) || 0,
                orderIndex: row.lessonOrder,
            });
        }
    }

    return Array.from(courseMap.values()).map((course) => ({
        ...course,
        modules: Array.from(course.modules.values()),
    }));
};

// ---------------- Public APIs ----------------

const aggregateLearningDashboard = async (requestingUserId) => {
    if (!requestingUserId || typeof requestingUserId !== 'string') {
        throw new Error('aggregateLearningDashboard requires a valid requestingUserId (non-empty string).');
    }

    const student = await _resolveStudentId(requestingUserId);
    if (!student) throw new Error(`Student profile not found for userId: ${requestingUserId}`);
    const { studentId } = student;

    const enrolledCourses = await _fetchEnrolledCourses(studentId);
    if (enrolledCourses.length === 0) {
        return {
            courses: [],
            continueLearning: [],
            summary: { totalCourses: 0, totalCompleted: 0, overallPercentage: 0 },
            generatedAt: new Date().toISOString(),
        };
    }

    const courseIds = enrolledCourses.map((c) => c.courseId);
    const [lessonProgressRows, structureRows] = await Promise.all([
        _fetchLessonProgress(studentId),
        _fetchCourseStructure(courseIds),
    ]);

    const progressMap = new Map(lessonProgressRows.map((row) => [row.lessonId, row]));
    const courseTree = _buildCourseTree(structureRows, enrolledCourses);

    const coursesWithProgress = courseTree.map((course) => {
        const moduleProgressArray = course.modules.map((mod) =>
            calculateModuleProgress({ moduleId: mod.moduleId, lessons: mod.lessons }, progressMap)
        );

        const courseProgress = calculateCourseProgress(moduleProgressArray);

        const enrichedModules = course.modules.map((mod, idx) => ({
            moduleId: mod.moduleId,
            title: mod.moduleTitle,
            orderIndex: mod.orderIndex,
            progress: moduleProgressArray[idx],
            lessons: mod.lessons.map((lesson) => {
                const lp = progressMap.get(lesson.lessonId);
                return {
                    lessonId: lesson.lessonId,
                    title: lesson.title,
                    contentType: lesson.contentType,
                    durationSeconds: lesson.durationSeconds,
                    watchPercentage: lp ? calculateWatchPercentage(lp.watchSeconds, lesson.durationSeconds) : 0,
                    status: lp?.status ?? 'not_started',
                };
            }),
        }));

        return {
            courseId: course.courseId,
            title: course.courseTitle,
            skillTags: course.skillTags,
            status: course.status,
            enrolledAt: course.enrolledAt,
            progress: courseProgress,
            modules: enrichedModules,
        };
    });

    const continueLearning = calculateContinueLearning(courseTree, progressMap);

    const totalCourses = coursesWithProgress.length;
    const totalCompleted = coursesWithProgress.filter((c) => c.progress.total > 0 && c.progress.completed === c.progress.total).length;
    const overallLessonsCompleted = coursesWithProgress.reduce((sum, c) => sum + c.progress.completed, 0);
    const overallLessonsTotal = coursesWithProgress.reduce((sum, c) => sum + c.progress.total, 0);
    const overallPercentage = overallLessonsTotal > 0 ? Number(((overallLessonsCompleted / overallLessonsTotal) * 100).toFixed(1)) : 0;

    return {
        courses: serializeLearningData(coursesWithProgress),
        continueLearning: serializeLearningData(continueLearning),
        summary: serializeLearningData({ totalCourses, totalCompleted, overallPercentage }),
        generatedAt: new Date().toISOString(),
    };
};

// ---------------- Training module simple delegations ----------------
export const getCourseProgress = async (studentId) => {
    return await progressModel.getCourseProgress(studentId);
};

export const updateCourseProgress = async (studentId, courseId, progress) => {
    if (!studentId) throw new Error('Student authentication required');
    return await progressModel.updateCourseProgress(studentId, courseId, Number(progress));
};

export const getLearningStatistics = async (studentId) => {
    return await progressModel.getLearningStatistics(studentId);
};

export {
    aggregateLearningDashboard,
    calculateWatchPercentage,
    calculateModuleProgress,
    calculateCourseProgress,
    calculateContinueLearning,
    serializeLearningData,
};

