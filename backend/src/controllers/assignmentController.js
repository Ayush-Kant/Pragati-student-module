import AssignmentService from '../services/assignmentService.js';
import { normalizeError } from '../utils/assignmentHelpers.js';

const getActorStudentId = (req) => (req.user?.role === 'student' ? req.user.id : (req.query?.studentId ?? null));
const requireNonStudent = (req, message) => {
    if (req.user?.role === 'student') {
        throw normalizeError(message, 403);
    }
};

const requireStudent = (req, message) => {
    if (req.user?.role !== 'student') {
        throw normalizeError(message, 403);
    }
};

export const createAssignment = async (req, res, next) => {
    try {
        const payload = {
            ...req.validatedBody,
            studentId: req.validatedBody?.studentId ?? null,
            dueDate: req.validatedBody?.dueDate,
        };
        requireNonStudent(req, 'Access forbidden: Students cannot create assignments');
        const assignment = await AssignmentService.createAssignment(payload);
        res.status(201).json({ success: true, data: assignment });
    } catch (error) {
        next(error);
    }
};

export const listAssignments = async (req, res, next) => {
    try {
        const studentId = getActorStudentId(req);
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
        const { id } = req.validatedParams;
        const assignment = await AssignmentService.getAssignmentById(id);
        res.status(200).json({ success: true, data: assignment });
    } catch (error) {
        next(error);
    }
};

export const updateAssignment = async (req, res, next) => {
    try {
        requireNonStudent(req, 'Access forbidden: Students cannot update assignments');
        const { id } = req.validatedParams;
        const assignment = await AssignmentService.updateAssignment(id, req.validatedBody);
        res.status(200).json({ success: true, data: assignment });
    } catch (error) {
        next(error);
    }
};

export const deleteAssignment = async (req, res, next) => {
    try {
        requireNonStudent(req, 'Access forbidden: Students cannot delete assignments');
        const { id } = req.validatedParams;
        const result = await AssignmentService.deleteAssignment(id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const submitAssignment = async (req, res, next) => {
    try {
        requireStudent(req, 'Access forbidden: Only students can submit assignments');
        const { id } = req.validatedParams;
        const assignment = await AssignmentService.submitAssignment(id, req.user.id, req.validatedBody);
        res.status(200).json({ success: true, data: assignment });
    } catch (error) {
        next(error);
    }
};

export const getSubmission = async (req, res, next) => {
    try {
        const { id } = req.validatedParams;
        const studentId = getActorStudentId(req);
        if (!studentId) {
            throw normalizeError('studentId is required for non-student roles', 400);
        }
        const submission = await AssignmentService.getSubmission(id, studentId);
        res.status(200).json({ success: true, data: submission });
    } catch (error) {
        next(error);
    }
};

export const listSubmissions = async (req, res, next) => {
    try {
        const studentId = getActorStudentId(req);
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
        const studentId = getActorStudentId(req);
        const stats = await AssignmentService.getStatistics({ studentId });
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        next(error);
    }
};

export const addFeedback = async (req, res, next) => {
    try {
        requireNonStudent(req, 'Access forbidden: Students cannot add feedback');
        const { id, studentId } = req.validatedParams;
        const feedback = await AssignmentService.addFeedback(id, studentId, req.validatedBody);
        res.status(200).json({ success: true, data: feedback });
    } catch (error) {
        next(error);
    }
};

export const addGrade = async (req, res, next) => {
    try {
        requireNonStudent(req, 'Access forbidden: Students cannot add grade');
        const { id, studentId } = req.validatedParams;
        const grade = await AssignmentService.addGrade(id, studentId, req.validatedBody);
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
