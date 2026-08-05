import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const discussionModel = {
  findAll: jest.fn(),
  count: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
};

const commentModel = {
  findByPk: jest.fn(),
  create: jest.fn(),
  count: jest.fn(),
};

const replyModel = {
  findByPk: jest.fn(),
  create: jest.fn(),
  count: jest.fn(),
};

const reactionModel = {
  findOne: jest.fn(),
  create: jest.fn(),
  count: jest.fn(),
};

const reportModel = {
  create: jest.fn(),
  count: jest.fn(),
};

jest.unstable_mockModule("../models/discussionModel.js", () => ({ default: discussionModel }));
jest.unstable_mockModule("../models/commentModel.js", () => ({ default: commentModel }));
jest.unstable_mockModule("../models/replyModel.js", () => ({ default: replyModel }));
jest.unstable_mockModule("../models/reactionModel.js", () => ({ default: reactionModel }));
jest.unstable_mockModule("../models/reportModel.js", () => ({ default: reportModel }));
jest.unstable_mockModule("../utils/discussionHelpers.js", () => ({ normalizeDiscussionQuery: ({ search, category, tags, sortBy = "latest", page = 1, pageSize = 20 }) => ({ where: { search, category, tags }, pagination: { page: Number(page), pageSize: Number(pageSize), offset: 0 }, sortBy }) }));
jest.unstable_mockModule("../models/discussionAssociations.js", () => ({ default: jest.fn() }));

const serviceModule = await import("../services/discussionService.js");
const {
  createDiscussion,
  listDiscussions,
  getDiscussionById,
  editDiscussion,
  removeDiscussion,
  createComment,
  createReply,
  editComment,
  deleteComment,
  toggleLike,
  toggleCommentLike,
  reportDiscussion,
  searchDiscussions,
  getDiscussionStatistics,
} = serviceModule;

describe("discussion services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a discussion", async () => {
    const createdDiscussion = { id: 1, title: "Hello" };
    discussionModel.create.mockResolvedValue(createdDiscussion);

    const result = await createDiscussion({ title: "Hello", content: "Body", category: "general", tags: ["a"], createdBy: 1 });

    expect(result).toEqual({ success: true, data: createdDiscussion, message: "Discussion created successfully" });
    expect(discussionModel.create).toHaveBeenCalledWith({ title: "Hello", content: "Body", category: "general", tags: ["a"], createdBy: 1 });
  });

  it("lists discussions with pagination and filtering", async () => {
    discussionModel.findAll.mockResolvedValue([{ id: 1 }]);
    discussionModel.count.mockResolvedValue(1);

    const result = await listDiscussions({ search: "react", category: "technical", page: 1, pageSize: 10 });

    expect(result.success).toBe(true);
    expect(discussionModel.findAll).toHaveBeenCalled();
    expect(discussionModel.count).toHaveBeenCalled();
    expect(result.metadata.page).toBe(1);
  });

  it("returns not found when a discussion is missing", async () => {
    discussionModel.findByPk.mockResolvedValue(null);

    const result = await getDiscussionById(99);

    expect(result).toEqual({ success: false, message: "Discussion not found" });
  });

  it("updates a discussion when the user is authorized", async () => {
    const discussion = { id: 2, createdBy: 1, update: jest.fn().mockResolvedValue(true) };
    discussionModel.findByPk.mockResolvedValue(discussion);

    const result = await editDiscussion(2, { title: "New" }, 1);

    expect(result.success).toBe(true);
    expect(discussion.update).toHaveBeenCalledWith({ title: "New" });
  });

  it("denies updating a discussion when the user is not the owner", async () => {
    const discussion = { id: 2, createdBy: 2 };
    discussionModel.findByPk.mockResolvedValue(discussion);

    const result = await editDiscussion(2, { title: "New" }, 1);

    expect(result).toEqual({ success: false, status: 403, message: "Permission denied" });
  });

  it("filters disallowed fields during discussion update", async () => {
    const discussion = { id: 2, createdBy: 1, update: jest.fn().mockResolvedValue(true) };
    discussionModel.findByPk.mockResolvedValue(discussion);

    await editDiscussion(2, { title: "New", id: 99, createdBy: 5, updatedAt: "2026-01-01" }, 1);

    expect(discussion.update).toHaveBeenCalledWith({ title: "New" });
  });

  it("rejects a report for a comment that does not belong to the discussion", async () => {
    discussionModel.findByPk.mockResolvedValue({ id: 1 });
    commentModel.findByPk.mockResolvedValue({ id: 2, discussionId: 99 });

    const result = await reportDiscussion(1, 1, { reason: "spam", reportType: "comment", commentId: 2 });

    expect(result).toEqual({ success: false, status: 400, message: "Comment does not belong to this discussion" });
  });

  it("rejects a report for a reply that does not belong to the discussion", async () => {
    discussionModel.findByPk.mockResolvedValue({ id: 1 });
    replyModel.findByPk.mockResolvedValue({ id: 3, commentId: 7 });
    commentModel.findByPk.mockResolvedValue({ id: 7, discussionId: 99 });

    const result = await reportDiscussion(1, 1, { reason: "spam", reportType: "reply", replyId: 3 });

    expect(result).toEqual({ success: false, status: 400, message: "Reply does not belong to this discussion" });
  });

  it("removes a discussion after authorization", async () => {
    const discussion = { id: 2, createdBy: 1, destroy: jest.fn().mockResolvedValue(true) };
    discussionModel.findByPk.mockResolvedValue(discussion);

    const result = await removeDiscussion(2, 1);

    expect(result).toEqual({ success: true, message: "Discussion deleted successfully" });
    expect(discussion.destroy).toHaveBeenCalled();
  });

  it("creates a comment for an existing discussion", async () => {
    const discussion = { id: 3 };
    discussionModel.findByPk.mockResolvedValue(discussion);
    commentModel.create.mockResolvedValue({ id: 7 });

    const result = await createComment(3, 1, "hello");

    expect(result.success).toBe(true);
    expect(commentModel.create).toHaveBeenCalledWith({ discussionId: 3, userId: 1, content: "hello" });
  });

  it("returns not found for missing comments in createReply", async () => {
    commentModel.findByPk.mockResolvedValue(null);

    const result = await createReply(8, 1, "test");

    expect(result).toEqual({ success: false, status: 404, message: "Comment not found" });
  });

  it("updates a comment when ownership matches", async () => {
    const comment = { id: 10, userId: 1, update: jest.fn().mockResolvedValue(true) };
    commentModel.findByPk.mockResolvedValue(comment);

    const result = await editComment(10, 1, "new content");

    expect(result.success).toBe(true);
    expect(comment.update).toHaveBeenCalledWith({ content: "new content" });
  });

  it("deletes a comment after authorization", async () => {
    const comment = { id: 10, userId: 1, destroy: jest.fn().mockResolvedValue(true) };
    commentModel.findByPk.mockResolvedValue(comment);

    const result = await deleteComment(10, 1);

    expect(result).toEqual({ success: true, message: "Comment deleted successfully" });
    expect(comment.destroy).toHaveBeenCalled();
  });

  it("toggles like state on a discussion", async () => {
    const discussion = { id: 1 };
    discussionModel.findByPk.mockResolvedValue(discussion);
    reactionModel.findOne.mockResolvedValue(null);
    reactionModel.create.mockResolvedValue({});

    const result = await toggleLike(1, 1);

    expect(result).toEqual({ success: true, data: { liked: true }, message: "Discussion liked" });
  });

  it("toggles like state on a comment", async () => {
    const comment = { id: 7 };
    commentModel.findByPk.mockResolvedValue(comment);
    reactionModel.findOne.mockResolvedValue(null);
    reactionModel.create.mockResolvedValue({});

    const result = await toggleCommentLike(7, 1);

    expect(result).toEqual({ success: true, data: { liked: true }, message: "Comment liked" });
  });

  it("reports a discussion and verifies the referenced comment", async () => {
    const discussion = { id: 1 };
    discussionModel.findByPk.mockResolvedValue(discussion);
    commentModel.findByPk.mockResolvedValue({ id: 2, discussionId: 1 });
    reportModel.create.mockResolvedValue({ id: 9 });

    const result = await reportDiscussion(1, 1, { reason: "spam", reportType: "comment", commentId: 2 });

    expect(result.success).toBe(true);
    expect(reportModel.create).toHaveBeenCalled();
  });

  it("searches discussions by delegating to the list helper", async () => {
    discussionModel.findAll.mockResolvedValue([{ id: 1 }]);
    discussionModel.count.mockResolvedValue(1);

    const result = await searchDiscussions({ q: "react" });

    expect(result.success).toBe(true);
  });

  it("returns discussion statistics", async () => {
    discussionModel.count.mockResolvedValue(2);
    commentModel.count.mockResolvedValue(3);
    replyModel.count.mockResolvedValue(4);
    reactionModel.count.mockResolvedValue(5);
    reportModel.count.mockResolvedValue(6);

    const result = await getDiscussionStatistics();

    expect(result).toEqual({ success: true, data: { totalDiscussions: 2, totalComments: 3, totalReplies: 4, totalLikes: 5, totalReports: 6 } });
  });
});
