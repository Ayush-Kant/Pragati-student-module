// learningController.js

import * as service from '../services/learningService.js';

const getCourses = async (req, res) => {
    try {
        const data = await service.getCourses(req.user?.id, req.query);

        res.status(200).json({
            success: true,
            courses: data,
            total: data.length,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getCourseDetail = async (req, res) => {
    try {
        const course = await service.getCourseDetail(req.params.courseId);

        if (!course) {
            return res.status(404).json({
                message: 'Course not found',
            });
        }

        res.status(200).json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getLesson = async (req, res) => {
    try {
        const lesson = await service.getLesson(req.params.lessonId);

        if (!lesson) {
            return res.status(404).json({
                message: 'Lesson not found',
            });
        }

        res.status(200).json(lesson);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateLessonProgress = async (req, res) => {
    try {
        const progress = await service.updateProgress(
            req.params.lessonId,
            req.user?.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: 'Lesson progress updated successfully.',
            data: progress,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const saveNotes = async (req, res) => {
    try {
        const note = await service.saveNotes(
            req.user?.id,
            req.body
        );

        res.status(201).json({
            success: true,
            message: 'Notes saved successfully.',
            data: note,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getResources = async (req, res) => {
    try {
        const resources = await service.getResources(req.params.lessonId);

        res.status(200).json({
            success: true,
            resources,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getContinueLearning = async (req, res) => {
    try {
        const data = await service.getContinueLearning(req.user?.id);

        res.status(200).json({
    success: true,
    data,
});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export {
    getCourses,
    getCourseDetail,
    getLesson,
    updateLessonProgress,
    saveNotes,
    getResources,
    getContinueLearning,
};