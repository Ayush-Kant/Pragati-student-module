import Joi from 'joi';
import {
    ASSIGNMENT_STATUS,
    ASSIGNMENT_TITLE_MAX_LENGTH,
    ASSIGNMENT_DESCRIPTION_MAX_LENGTH,
    FEEDBACK_GRADE_MAX_LENGTH,
} from '../constants/assignmentConstants.js';

export const createAssignmentSchema = Joi.object({
    title: Joi.string().trim().min(3).max(ASSIGNMENT_TITLE_MAX_LENGTH).required(),
    subject: Joi.string().trim().min(2).max(ASSIGNMENT_TITLE_MAX_LENGTH).required(),
    description: Joi.string().trim().max(ASSIGNMENT_DESCRIPTION_MAX_LENGTH).optional(),
    dueDate: Joi.date().required(),
    totalMarks: Joi.number().integer().min(1).required(),
    status: Joi.string().valid(...Object.values(ASSIGNMENT_STATUS)).default(ASSIGNMENT_STATUS.OPEN),
}).required();

export const updateAssignmentSchema = Joi.object({
    title: Joi.string().trim().min(3).max(ASSIGNMENT_TITLE_MAX_LENGTH).optional(),
    subject: Joi.string().trim().min(2).max(ASSIGNMENT_TITLE_MAX_LENGTH).optional(),
    description: Joi.string().trim().max(ASSIGNMENT_DESCRIPTION_MAX_LENGTH).optional(),
    dueDate: Joi.date().optional(),
    totalMarks: Joi.number().integer().min(1).optional(),
    status: Joi.string().valid(...Object.values(ASSIGNMENT_STATUS)).optional(),
}).required();

// File submissions arrive as multipart/form-data with the actual file on req.file.
// Body-level validation must therefore not reject an otherwise valid file-only submission.
// The assignment service performs the final submission-type/content/file validation.
export const submitAssignmentSchema = Joi.object({
    content: Joi.string().trim().max(5000).optional(),
    fileUrl: Joi.string().uri().optional(),
}).unknown(false).required();

export const assignmentIdSchema = Joi.object({
    id: Joi.number().integer().min(1).required(),
}).required();

export const assignmentIdAndStudentIdSchema = Joi.object({
    id: Joi.number().integer().min(1).required(),
    studentId: Joi.number().integer().min(1).required(),
}).required();

export const feedbackSchema = Joi.object({
    remarks: Joi.string().trim().min(1).max(4000).required(),
    grade: Joi.string().trim().min(1).max(FEEDBACK_GRADE_MAX_LENGTH).required(),
    inlineComments: Joi.alternatives().try(Joi.array().items(Joi.object().unknown(true)), Joi.object().unknown(true)).optional(),
}).required();

export const gradeSchema = Joi.object({
    score: Joi.number().min(0).max(100).required(),
    remarks: Joi.string().trim().max(2000).optional(),
}).required();
