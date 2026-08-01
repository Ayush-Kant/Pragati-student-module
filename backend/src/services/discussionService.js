import { Op, fn, col, literal } from "@sequelize/core";
import sequelize from "../../config/sequelize.js";
import Discussion from "../models/discussionModel.js";
import DiscussionComment from "../models/commentModel.js";
import DiscussionReply from "../models/replyModel.js";
import DiscussionReaction from "../models/reactionModel.js";
import DiscussionReport from "../models/reportModel.js";

Discussion.hasMany(DiscussionComment, { foreignKey: "discussion_id", as: "comments" });
DiscussionComment.belongsTo(Discussion, { foreignKey: "discussion_id", as: "discussion" });
DiscussionComment.hasMany(DiscussionReply, { foreignKey: "comment_id", as: "replies" });
DiscussionReply.belongsTo(DiscussionComment, { foreignKey: "comment_id", as: "comment" });
Discussion.hasMany(DiscussionReaction, { foreignKey: "discussion_id", as: "reactions" });
DiscussionComment.hasMany(DiscussionReaction, { foreignKey: "comment_id", as: "reactions" });
Discussion.hasMany(DiscussionReport, { foreignKey: "discussion_id", as: "reports" });
DiscussionComment.hasMany(DiscussionReport, { foreignKey: "comment_id", as: "reports" });
DiscussionReply.hasMany(DiscussionReport, { foreignKey: "reply_id", as: "reports" });

export const createDiscussion = async ({ title, content, category, tags, createdBy }) => {
  const discussion = await Discussion.create({ title, content, category, tags, createdBy });
  return { success: true, data: discussion, message: "Discussion created successfully" };
};

export const listDiscussions = async (query = {}) => {
  const { search, category, tags, sortBy = "latest", page = 1, pageSize = 20 } = query;
  const offset = (Number(page) - 1) * Number(pageSize);
  const where = {};

  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { content: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (category) {
    where.category = category;
  }

  if (tags) {
    const tagList = Array.isArray(tags) ? tags : String(tags).split(",").map((tag) => tag.trim()).filter(Boolean);
    if (tagList.length) {
      where.tags = { [Op.overlap]: tagList };
    }
  }

  const likeCountLiteral = literal(`(
      SELECT COUNT(*) FROM discussion_reactions dr
      WHERE dr.discussion_id = "Discussion".id AND dr.type = 'like'
  )`);

  const discussions = await Discussion.findAll({
    where,
    attributes: {
      include: [[likeCountLiteral, "likeCount"]],
    },
    include: [
      {
        model: DiscussionComment,
        as: "comments",
        attributes: ["id"],
      },
    ],
    order: sortBy === "popular"
      ? [[literal("likeCount"), "DESC"], ["created_at", "DESC"]]
      : [["created_at", "DESC"]],
    limit: Number(pageSize),
    offset,
  });

  const total = await Discussion.count({ where });
  return {
    success: true,
    data: discussions,
    metadata: { total, page: Number(page), pageSize: Number(pageSize) },
  };
};

export const getDiscussionById = async (discussionId) => {
  const discussion = await Discussion.findByPk(discussionId, {
    include: [
      {
        model: DiscussionComment,
        as: "comments",
        include: [
          {
            model: DiscussionReply,
            as: "replies",
          },
          {
            model: DiscussionReaction,
            as: "reactions",
          },
        ],
      },
      {
        model: DiscussionReaction,
        as: "reactions",
      },
      {
        model: DiscussionReport,
        as: "reports",
      },
    ],
  });

  if (!discussion) {
    return { success: false, message: "Discussion not found" };
  }

  return { success: true, data: discussion };
};

export const editDiscussion = async (discussionId, changes, userId) => {
  const discussion = await Discussion.findByPk(discussionId);
  if (!discussion) return { success: false, status: 404, message: "Discussion not found" };
  if (discussion.createdBy !== userId) return { success: false, status: 403, message: "Permission denied" };

  await discussion.update(changes);
  return { success: true, data: discussion, message: "Discussion updated successfully" };
};

export const removeDiscussion = async (discussionId, userId) => {
  const discussion = await Discussion.findByPk(discussionId);
  if (!discussion) return { success: false, status: 404, message: "Discussion not found" };
  if (discussion.createdBy !== userId) return { success: false, status: 403, message: "Permission denied" };

  await discussion.destroy();
  return { success: true, message: "Discussion deleted successfully" };
};

export const createComment = async (discussionId, userId, content) => {
  const discussion = await Discussion.findByPk(discussionId);
  if (!discussion) return { success: false, status: 404, message: "Discussion not found" };

  const comment = await DiscussionComment.create({ discussionId, userId, content });
  return { success: true, data: comment, message: "Comment added successfully" };
};

export const createReply = async (commentId, userId, content) => {
  const comment = await DiscussionComment.findByPk(commentId);
  if (!comment) return { success: false, status: 404, message: "Comment not found" };

  const reply = await DiscussionReply.create({ commentId, userId, content });
  return { success: true, data: reply, message: "Reply added successfully" };
};

export const editComment = async (commentId, userId, content) => {
  const comment = await DiscussionComment.findByPk(commentId);
  if (!comment) return { success: false, status: 404, message: "Comment not found" };
  if (comment.userId !== userId) return { success: false, status: 403, message: "Permission denied" };

  await comment.update({ content });
  return { success: true, data: comment, message: "Comment updated successfully" };
};

export const deleteComment = async (commentId, userId) => {
  const comment = await DiscussionComment.findByPk(commentId);
  if (!comment) return { success: false, status: 404, message: "Comment not found" };
  if (comment.userId !== userId) return { success: false, status: 403, message: "Permission denied" };

  await comment.destroy();
  return { success: true, message: "Comment deleted successfully" };
};

export const toggleLike = async (discussionId, userId) => {
  const discussion = await Discussion.findByPk(discussionId);
  if (!discussion) return { success: false, status: 404, message: "Discussion not found" };

  const reaction = await DiscussionReaction.findOne({ where: { discussionId, userId, type: "like" } });
  if (reaction) {
    await reaction.destroy();
    return { success: true, data: { liked: false }, message: "Discussion unliked" };
  }

  await DiscussionReaction.create({ discussionId, userId, type: "like" });
  return { success: true, data: { liked: true }, message: "Discussion liked" };
};

export const toggleCommentLike = async (commentId, userId) => {
  const comment = await DiscussionComment.findByPk(commentId);
  if (!comment) return { success: false, status: 404, message: "Comment not found" };

  const reaction = await DiscussionReaction.findOne({ where: { commentId, userId, type: "like" } });
  if (reaction) {
    await reaction.destroy();
    return { success: true, data: { liked: false }, message: "Comment unliked" };
  }

  await DiscussionReaction.create({ commentId, userId, type: "like" });
  return { success: true, data: { liked: true }, message: "Comment liked" };
};

export const reportDiscussion = async (discussionId, userId, { reason, reportType, commentId, replyId }) => {
  const discussion = await Discussion.findByPk(discussionId);
  if (!discussion) return { success: false, status: 404, message: "Discussion not found" };

  const reportPayload = {
    discussionId,
    reportedBy: userId,
    reason,
    status: "pending",
  };

  if (reportType === "comment" && commentId) {
    reportPayload.commentId = commentId;
  }

  if (reportType === "reply" && replyId) {
    reportPayload.replyId = replyId;
  }

  const report = await DiscussionReport.create(reportPayload);
  return { success: true, data: report, message: "Report submitted successfully" };
};

export const searchDiscussions = async (query) => {
  const { q, category, tags, sortBy = "latest", page = 1, pageSize = 20 } = query;
  const search = q || query.search;
  return listDiscussions({ search, category, tags, sortBy, page, pageSize });
};

export const getDiscussionStatistics = async () => {
  const totalDiscussions = await Discussion.count();
  const totalComments = await DiscussionComment.count();
  const totalReplies = await DiscussionReply.count();
  const totalLikes = await DiscussionReaction.count({ where: { type: "like" } });
  const totalReports = await DiscussionReport.count();

  return {
    success: true,
    data: { totalDiscussions, totalComments, totalReplies, totalLikes, totalReports },
  };
};
