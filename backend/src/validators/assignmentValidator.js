import Joi from 'joi';

export const createAssignmentSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).required(),
  subject: Joi.string().trim().min(2).max(255).required(),
  description: Joi.string().trim().max(2000).optional(),
  dueDate: Joi.date().iso().required(),
  totalMarks: Joi.number().integer().min(1).required(),
  status: Joi.string().valid('Open', 'Closed', 'Pending').default('Open'),
}).required();

export const updateAssignmentSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).optional(),
  subject: Joi.string().trim().min(2).max(255).optional(),
  description: Joi.string().trim().max(2000).optional(),
  dueDate: Joi.date().iso().optional(),
  totalMarks: Joi.number().integer().min(1).optional(),
  status: Joi.string().valid('Open', 'Closed', 'Pending').optional(),
}).required();

export const submitAssignmentSchema = Joi.object({
  content: Joi.string().trim().max(5000).optional(),
  fileUrl: Joi.string().uri().optional(),
}).or('content', 'fileUrl').required();

export const assignmentIdSchema = Joi.object({
  id: Joi.number().integer().min(1).required(),
}).required();

export const feedbackSchema = Joi.object({
  remarks: Joi.string().trim().min(1).max(4000).required(),
  grade: Joi.string().trim().min(1).max(20).required(),
}).required();

export const gradeSchema = Joi.object({
  score: Joi.number().min(0).max(100).required(),
  remarks: Joi.string().trim().max(2000).optional(),
}).required();
