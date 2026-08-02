import * as discussionService from "../services/discussionService.js";

export const getDiscussionStatistics = async (req, res, next) => {
  try {
    const result = await discussionService.getDiscussionStatistics();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAllDiscussions = async (req, res, next) => {
  try {
    const result = await discussionService.listDiscussions(req.query);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getDiscussionDetails = async (req, res, next) => {
  try {
    const discussionId = Number(req.params.discussionId);
    const result = await discussionService.getDiscussionById(discussionId);
    if (!result.success) return res.status(404).json(result);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getUserId = (req) => req.user?.id || req.user?.userId || req.user?.uid;

export const createDiscussion = async (req, res, next) => {
  try {
    const payload = { ...req.body, createdBy: getUserId(req) };
    const result = await discussionService.createDiscussion(payload);
    if (!result.success) return res.status(400).json(result);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateDiscussion = async (req, res, next) => {
  try {
    const discussionId = Number(req.params.discussionId);
    const result = await discussionService.editDiscussion(discussionId, req.body, getUserId(req));
    if (!result.success) return res.status(result.status || 400).json(result);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteDiscussion = async (req, res, next) => {
  try {
    const discussionId = Number(req.params.discussionId);
    const result = await discussionService.removeDiscussion(discussionId, getUserId(req));
    if (!result.success) return res.status(result.status || 400).json(result);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const addDiscussionComment = async (req, res, next) => {
  try {
    const discussionId = Number(req.params.discussionId);
    const result = await discussionService.createComment(discussionId, getUserId(req), req.body.content);
    if (!result.success) return res.status(result.status || 400).json(result);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const addCommentReply = async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    const result = await discussionService.createReply(commentId, getUserId(req), req.body.content);
    if (!result.success) return res.status(result.status || 400).json(result);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateDiscussionComment = async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    const result = await discussionService.editComment(commentId, getUserId(req), req.body.content);
    if (!result.success) return res.status(result.status || 400).json(result);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const removeDiscussionComment = async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    const result = await discussionService.deleteComment(commentId, getUserId(req));
    if (!result.success) return res.status(result.status || 400).json(result);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const toggleDiscussionLike = async (req, res, next) => {
  try {
    const discussionId = Number(req.params.discussionId);
    const result = await discussionService.toggleLike(discussionId, getUserId(req));
    if (!result.success) return res.status(result.status || 400).json(result);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const toggleCommentLike = async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    const result = await discussionService.toggleCommentLike(commentId, getUserId(req));
    if (!result.success) return res.status(result.status || 400).json(result);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const reportDiscussion = async (req, res, next) => {
  try {
    const discussionId = Number(req.params.discussionId);
    const result = await discussionService.reportDiscussion(discussionId, getUserId(req), req.body);
    if (!result.success) return res.status(result.status || 400).json(result);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const searchDiscussions = async (req, res, next) => {
  try {
    const query = req.query;
    const result = await discussionService.searchDiscussions(query);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
