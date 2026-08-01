import Joi from "joi";

const idSchema = Joi.object({
  discussionId: Joi.number().integer().positive().required(),
  commentId: Joi.number().integer().positive().required(),
});

export const validateIdParam = Joi.object({
  discussionId: Joi.number().integer().positive().required(),
});

export const validateCommentIdParam = Joi.object({
  commentId: Joi.number().integer().positive().required(),
});

export const validateCreateDiscussion = Joi.object({
  title: Joi.string().trim().min(5).max(500).required(),
  content: Joi.string().trim().min(10).required(),
  category: Joi.string().trim().max(100).optional().allow(null, ""),
  tags: Joi.array().items(Joi.string().trim().max(50)).optional().default([]),
});

export const validateUpdateDiscussion = Joi.object({
  title: Joi.string().trim().min(5).max(500).optional(),
  content: Joi.string().trim().min(10).optional(),
  category: Joi.string().trim().max(100).optional().allow(null, ""),
  tags: Joi.array().items(Joi.string().trim().max(50)).optional(),
});

export const validateCreateComment = Joi.object({
  content: Joi.string().trim().min(1).max(2000).required(),
});

export const validateCreateReply = Joi.object({
  content: Joi.string().trim().min(1).max(2000).required(),
});

export const validateReportDiscussion = Joi.object({
  reason: Joi.string().trim().min(5).max(1000).required(),
  reportType: Joi.string().valid("discussion", "comment", "reply").optional(),
  commentId: Joi.number().integer().positive().optional(),
  replyId: Joi.number().integer().positive().optional(),
});
