import AssignmentService from '../services/assignmentService.js';

export const createAssignment = async (req, res, next) => {
    try {
        const payload = {
            ...req.validatedBody,
            studentId: req.user?.id ?? null,
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
        const filters = {
            studentId: req.query?.studentId ?? req.user?.id ?? null,
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
        const assignment = await AssignmentService.getAssignmentById(req.params.id);
        res.status(200).json({ success: true, data: assignment });
    } catch (error) {
        next(error);
    }
};

export const updateAssignment = async (req, res, next) => {
    try {
        const assignment = await AssignmentService.updateAssignment(req.params.id, req.validatedBody);
        res.status(200).json({ success: true, data: assignment });
    } catch (error) {
        next(error);
    }
};

export const deleteAssignment = async (req, res, next) => {
    try {
        const result = await AssignmentService.deleteAssignment(req.params.id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const submitAssignment = async (req, res, next) => {
    try {
        const assignment = await AssignmentService.submitAssignment(req.params.id, req.user?.id, req.validatedBody);
        res.status(200).json({ success: true, data: assignment });
    } catch (error) {
        next(error);
    }
};

export const getSubmission = async (req, res, next) => {
    try {
        const submission = await AssignmentService.getSubmission(req.params.id, req.user?.id);
        res.status(200).json({ success: true, data: submission });
    } catch (error) {
        next(error);
    }
};

export const addFeedback = async (req, res, next) => {
    try {
        const feedback = await AssignmentService.addFeedback(req.params.id, req.params.studentId, req.validatedBody);
        res.status(200).json({ success: true, data: feedback });
    } catch (error) {
        next(error);
    }
};

export const addGrade = async (req, res, next) => {
    try {
        const grade = await AssignmentService.addGrade(req.params.id, req.params.studentId, req.validatedBody);
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
    addFeedback,
    addGrade,
};
