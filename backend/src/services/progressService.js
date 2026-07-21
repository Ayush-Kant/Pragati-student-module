// progressService.js
// Combined learning and training progress service.
// Responsibilities:
// - training progress lookups and updates
// - dashboard aggregation for enrolled courses
// - progress serialization helpers

import * as progressModel from '../models/progressModel.js';
import {
    calculateWatchPercentage,
    calculateModuleProgress,
    calculateCourseProgress,
    calculateContinueLearning,
    serializeLearningData,
} from '../utils/learningUtils.js';

const _resolveStudentId = async (uuidId) => {
    return progressModel.resolveStudentId(uuidId);
};

const _fetchEnrolledCourses = async (studentId) => {
    return progressModel.fetchEnrolledCourses(studentId);
};

const _fetchLessonProgress = async (studentId) => {
    return progressModel.fetchLessonProgress(studentId);
};

const _fetchCourseStructure = async (courseIds) => {
    return progressModel.fetchCourseStructure(courseIds);
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

const aggregateLearningDashboard = async (requestingUserId) => {
    if (!requestingUserId || typeof requestingUserId !== 'string') {
        const error = new Error('aggregateLearningDashboard requires a valid requestingUserId.');
        error.statusCode = 400;
        throw error;
    }

    const student = await _resolveStudentId(requestingUserId);
    if (!student) {
        const error = new Error(`Student profile not found for userId: ${requestingUserId}`);
        error.statusCode = 404;
        throw error;
    }

    const enrolledCourses = await _fetchEnrolledCourses(student.studentId);
    if (enrolledCourses.length === 0) {
        return {
            courses: [],
            continueLearning: [],
            summary: { totalCourses: 0, totalCompleted: 0, overallPercentage: 0 },
            generatedAt: new Date().toISOString(),
        };
    }

    const courseIds = enrolledCourses.map((course) => course.courseId);
    const [lessonProgressRows, structureRows] = await Promise.all([
        _fetchLessonProgress(student.studentId),
        _fetchCourseStructure(courseIds),
    ]);

    const progressMap = new Map(lessonProgressRows.map((row) => [row.lessonId, row]));
    const courseTree = _buildCourseTree(structureRows, enrolledCourses);

    const coursesWithProgress = courseTree.map((course) => {
        const moduleProgressArray = course.modules.map((mod) =>
            calculateModuleProgress({ moduleId: mod.moduleId, lessons: mod.lessons }, progressMap)
        );

        const courseProgress = calculateCourseProgress(moduleProgressArray);

        const enrichedModules = course.modules.map((mod, index) => ({
            moduleId: mod.moduleId,
            title: mod.moduleTitle,
            orderIndex: mod.orderIndex,
            progress: moduleProgressArray[index],
            lessons: mod.lessons.map((lesson) => {
                const lessonProgress = progressMap.get(lesson.lessonId);
                return {
                    lessonId: lesson.lessonId,
                    title: lesson.title,
                    contentType: lesson.contentType,
                    durationSeconds: lesson.durationSeconds,
                    watchPercentage: lessonProgress
                        ? calculateWatchPercentage(lessonProgress.watchSeconds, lesson.durationSeconds)
                        : 0,
                    status: lessonProgress?.status ?? 'not_started',
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
    const totalCompleted = coursesWithProgress.filter(
        (course) => course.progress.total > 0 && course.progress.completed === course.progress.total
    ).length;
    const overallLessonsCompleted = coursesWithProgress.reduce((sum, course) => sum + course.progress.completed, 0);
    const overallLessonsTotal = coursesWithProgress.reduce((sum, course) => sum + course.progress.total, 0);
    const overallPercentage = overallLessonsTotal > 0
        ? Number(((overallLessonsCompleted / overallLessonsTotal) * 100).toFixed(1))
        : 0;

    return {
        courses: serializeLearningData(coursesWithProgress),
        continueLearning: serializeLearningData(continueLearning),
        summary: serializeLearningData({
            totalCourses,
            totalCompleted,
            overallPercentage,
        }),
        generatedAt: new Date().toISOString(),
    };
};

export const getCourseProgress = async (studentId) => {
    return await progressModel.getCourseProgress(studentId);
};

export const updateCourseProgress = async (studentId, courseId, progress) => {
    if (!studentId) {
        const error = new Error('Student authentication required');
        error.statusCode = 401;
        throw error;
    }

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
