// admin.course.controller.js

import * as service from '../services/admin.course.service.js';

const listCourses = async (req, res) => {
    try {
        const data = await service.listCourses(req.query);
        res.status(200).json({
            courses: data,
            total: data.length,
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 20,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getCourseById = async (req, res) => {
    try {
        const course = await service.getCourseById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateCourseStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const course = await service.updateCourseStatus(req.params.id, status);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json({
            success: true,
            message: 'Course status updated successfully.',
            course: {
                courseId: course.courseId,
                status: course.status,
                updatedAt: course.updatedAt,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getTrainingStats = async (req, res) => {
    try {
        const stats = await service.getTrainingStats();
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export {
    listCourses,
    getCourseById,
    updateCourseStatus,
    getTrainingStats,
};
