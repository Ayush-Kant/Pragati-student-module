import AssignmentService from '../services/assignmentService.js';
import { normalizeError } from '../utils/assignmentHelpers.js';

export const createAssignment = async (req, res, next) => {
    try {
        if (req.user?.role === 'student') {
            throw normalizeError('Access forbidden: Students cannot create assignments', 403);
        }
        const payload = {
            ...req.validatedBody,
            studentId: req.validatedBody?.studentId ?? null,
            dueDate: req.validatedBody?.dueDate,
        };
        const assignment = await AssignmentService.createAssignment(payload);
        res.status(201).json({ success: true, data: assignment });
    } catch (error) {
        next(error);
    }
};

export const listAssignments = async (req, res, next) => {
    try {
        const studentId = req.user?.role === 'student' ? req.user.id : (req.query?.studentId ?? null);
        const filters = {
            studentId,
            status: req.query?.status,
        };
        const assignments = await AssignmentService.listAssignments(filters);
        res.status(200).json({ success: true, data: assignments });
    } catch (error) {
        next(error);
    }
};

export const getAssignmentById = async (req, res, next) => {
    try {
        const assignment = await AssignmentService.getAssignmentById(req.validatedParams.id);
        res.status(200).json({ success: true, data: assignment });
    } catch (error) {
        next(error);
    }
};

export const updateAssignment = async (req, res, next) => {
    try {
        if (req.user?.role === 'student') {
            throw normalizeError('Access forbidden: Students cannot update assignments', 403);
        }
        const assignment = await AssignmentService.updateAssignment(req.validatedParams.id, req.validatedBody);
        res.status(200).json({ success: true, data: assignment });
    } catch (error) {
        next(error);
    }
};

export const deleteAssignment = async (req, res, next) => {
    try {
        if (req.user?.role === 'student') {
            throw normalizeError('Access forbidden: Students cannot delete assignments', 403);
        }
        const result = await AssignmentService.deleteAssignment(req.validatedParams.id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const submitAssignment = async (req, res, next) => {
    try {
        if (req.user?.role !== 'student') {
            throw normalizeError('Access forbidden: Only students can submit assignments', 403);
        }
        const assignment = await AssignmentService.submitAssignment(req.validatedParams.id, req.user.id, req.validatedBody);
        res.status(200).json({ success: true, data: assignment });
    } catch (error) {
        next(error);
    }
};

export const getSubmission = async (req, res, next) => {
    try {
        const studentId = req.user?.role === 'student' ? req.user.id : (req.query?.studentId ?? null);
        if (!studentId) {
            throw normalizeError('studentId is required for non-student roles', 400);
        }
        const submission = await AssignmentService.getSubmission(req.validatedParams.id, studentId);
        res.status(200).json({ success: true, data: submission });
    } catch (error) {
        next(error);
    }
};

export const listSubmissions = async (req, res, next) => {
    try {
        const studentId = req.user?.role === 'student' ? req.user.id : (req.query?.studentId ?? null);
        const filters = {
            studentId,
            assignmentId: req.query?.assignmentId ?? null,
            status: req.query?.status ?? null,
        };
        const submissions = await AssignmentService.listSubmissions(filters);
        res.status(200).json({ success: true, data: submissions });
    } catch (error) {
        next(error);
    }
};

export const getStatistics = async (req, res, next) => {
    try {
        const studentId = req.user?.role === 'student' ? req.user.id : (req.query?.studentId ?? null);
        const stats = await AssignmentService.getStatistics({ studentId });
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        next(error);
    }
};

export const addFeedback = async (req, res, next) => {
    try {
        if (req.user?.role === 'student') {
            throw normalizeError('Access forbidden: Students cannot add feedback', 403);
        }
        const feedback = await AssignmentService.addFeedback(req.validatedParams.id, req.validatedParams.studentId, req.validatedBody);
        res.status(200).json({ success: true, data: feedback });
    } catch (error) {
        next(error);
    }
};

export const addGrade = async (req, res, next) => {
    try {
        if (req.user?.role === 'student') {
            throw normalizeError('Access forbidden: Students cannot add grade', 403);
        }
        const grade = await AssignmentService.addGrade(req.validatedParams.id, req.validatedParams.studentId, req.validatedBody);
        res.status(200).json({ success: true, data: grade });
    } catch (error) {
        next(error);
    }
};

export default {
    createAssignment,
    listAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
    submitAssignment,
    getSubmission,
    listSubmissions,
    getStatistics,
    addFeedback,
    addGrade,
};
