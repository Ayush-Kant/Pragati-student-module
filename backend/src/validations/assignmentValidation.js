import Joi from 'joi';
import {
    ASSIGNMENT_STATUS_CLOSED,
    ASSIGNMENT_STATUS_OPEN,
    ASSIGNMENT_STATUS_PENDING,
    ASSIGNMENT_STATUSES,
} from '../constants/assignmentConstants.js';

export const createAssignmentSchema = Joi.object({
    title: Joi.string().trim().min(3).max(255).required(),
    subject: Joi.string().trim().min(2).max(255).required(),
    description: Joi.string().trim().max(2000).optional(),
    dueDate: Joi.date().iso().required(),
    totalMarks: Joi.number().integer().min(1).required(),
    status: Joi.string().valid(...ASSIGNMENT_STATUSES).default(ASSIGNMENT_STATUS_OPEN),
}).required();

export const updateAssignmentSchema = Joi.object({
    title: Joi.string().trim().min(3).max(255).optional(),
    subject: Joi.string().trim().min(2).max(255).optional(),
    description: Joi.string().trim().max(2000).optional(),
    dueDate: Joi.date().iso().optional(),
    totalMarks: Joi.number().integer().min(1).optional(),
    status: Joi.string().valid(...ASSIGNMENT_STATUSES).optional(),
}).required();

export const submitAssignmentSchema = Joi.object({
    content: Joi.string().trim().max(5000).optional(),
    fileUrl: Joi.string().uri().optional(),
}).or('content', 'fileUrl').required();

export const assignmentIdSchema = Joi.object({
    id: Joi.number().integer().min(1).required(),
}).required();

export const assignmentIdAndStudentIdSchema = Joi.object({
    id: Joi.number().integer().min(1).required(),
    studentId: Joi.number().integer().min(1).required(),
}).required();

export const feedbackSchema = Joi.object({
    remarks: Joi.string().trim().min(1).max(4000).required(),
    grade: Joi.string().trim().min(1).max(20).required(),
}).required();

export const gradeSchema = Joi.object({
    score: Joi.number().min(0).max(100).required(),
    remarks: Joi.string().trim().max(2000).optional(),
}).required();
