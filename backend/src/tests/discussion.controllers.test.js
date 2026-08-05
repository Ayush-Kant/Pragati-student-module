import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const mockDiscussionService = {
  getDiscussionStatistics: jest.fn(),
  listDiscussions: jest.fn(),
  getDiscussionById: jest.fn(),
  createDiscussion: jest.fn(),
  editDiscussion: jest.fn(),
  removeDiscussion: jest.fn(),
  createComment: jest.fn(),
  createReply: jest.fn(),
  editComment: jest.fn(),
  deleteComment: jest.fn(),
  toggleLike: jest.fn(),
  toggleCommentLike: jest.fn(),
  reportDiscussion: jest.fn(),
  searchDiscussions: jest.fn(),
};

jest.unstable_mockModule("../services/discussionService.js", () => mockDiscussionService);

const controllerModule = await import("../controllers/discussionController.js");

const {
  getDiscussionStatistics,
  getAllDiscussions,
  getDiscussionDetails,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  addDiscussionComment,
  addCommentReply,
  updateDiscussionComment,
  removeDiscussionComment,
  toggleDiscussionLike,
  toggleCommentLike,
  reportDiscussion,
  searchDiscussions,
} = controllerModule;

const buildRes = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res;
};

describe("discussion controllers", () => {
  beforeEach(() => {
    Object.values(mockDiscussionService).forEach((fn) => fn.mockReset());
  });

  it("returns statistics from the service", async () => {
    const res = buildRes();
    mockDiscussionService.getDiscussionStatistics.mockResolvedValue({ success: true, data: { totalDiscussions: 1 } });

    await getDiscussionStatistics({}, res, jest.fn());

    expect(mockDiscussionService.getDiscussionStatistics).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: { totalDiscussions: 1 } });
  });

  it("lists discussions with the query payload", async () => {
    const res = buildRes();
    mockDiscussionService.listDiscussions.mockResolvedValue({ success: true, data: [] });

    await getAllDiscussions({ query: { page: 1 } }, res, jest.fn());

    expect(mockDiscussionService.listDiscussions).toHaveBeenCalledWith({ page: 1 });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 404 when a discussion is missing", async () => {
    const res = buildRes();
    const next = jest.fn();
    mockDiscussionService.getDiscussionById.mockResolvedValue({ success: false, message: "Discussion not found" });

    await getDiscussionDetails({ params: { discussionId: "2" } }, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Discussion not found" });
  });

  it("creates a discussion using the authenticated user id", async () => {
    const res = buildRes();
    mockDiscussionService.createDiscussion.mockResolvedValue({ success: true, data: { id: 1 } });

    await createDiscussion({ body: { title: "Hello" }, user: { id: 9 } }, res, jest.fn());

    expect(mockDiscussionService.createDiscussion).toHaveBeenCalledWith({ title: "Hello", createdBy: 9 });
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("returns 401 when the user is not authenticated for createDiscussion", async () => {
    const res = buildRes();

    await createDiscussion({ body: { title: "Hello" }, user: null }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Authentication required" });
  });

  it("updates a discussion and forwards permission errors", async () => {
    const res = buildRes();
    mockDiscussionService.editDiscussion.mockResolvedValue({ success: false, status: 403, message: "Permission denied" });

    await updateDiscussion({ params: { discussionId: "1" }, body: { title: "New" }, user: { id: 2 } }, res, jest.fn());

    expect(mockDiscussionService.editDiscussion).toHaveBeenCalledWith(1, { title: "New" }, 2);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ success: false, status: 403, message: "Permission denied" });
  });

  it("deletes a discussion with the current user id", async () => {
    const res = buildRes();
    mockDiscussionService.removeDiscussion.mockResolvedValue({ success: true, message: "Deleted" });

    await deleteDiscussion({ params: { discussionId: "1" }, user: { id: 2 } }, res, jest.fn());

    expect(mockDiscussionService.removeDiscussion).toHaveBeenCalledWith(1, 2);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("adds a discussion comment with the authenticated user id", async () => {
    const res = buildRes();
    mockDiscussionService.createComment.mockResolvedValue({ success: true, data: { id: 1 } });

    await addDiscussionComment({ params: { discussionId: "3" }, body: { content: "nice" }, user: { id: 4 } }, res, jest.fn());

    expect(mockDiscussionService.createComment).toHaveBeenCalledWith(3, 4, "nice");
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("adds a reply to a comment", async () => {
    const res = buildRes();
    mockDiscussionService.createReply.mockResolvedValue({ success: true, data: { id: 2 } });

    await addCommentReply({ params: { commentId: "5" }, body: { content: "reply" }, user: { id: 4 } }, res, jest.fn());

    expect(mockDiscussionService.createReply).toHaveBeenCalledWith(5, 4, "reply");
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("updates a comment and returns a 200 response", async () => {
    const res = buildRes();
    mockDiscussionService.editComment.mockResolvedValue({ success: true, data: { id: 5 } });

    await updateDiscussionComment({ params: { commentId: "5" }, body: { content: "edited" }, user: { id: 4 } }, res, jest.fn());

    expect(mockDiscussionService.editComment).toHaveBeenCalledWith(5, 4, "edited");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("removes a comment with the current user id", async () => {
    const res = buildRes();
    mockDiscussionService.deleteComment.mockResolvedValue({ success: true, message: "Deleted" });

    await removeDiscussionComment({ params: { commentId: "5" }, user: { id: 4 } }, res, jest.fn());

    expect(mockDiscussionService.deleteComment).toHaveBeenCalledWith(5, 4);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("toggles a discussion like", async () => {
    const res = buildRes();
    mockDiscussionService.toggleLike.mockResolvedValue({ success: true, data: { liked: true } });

    await toggleDiscussionLike({ params: { discussionId: "1" }, user: { id: 4 } }, res, jest.fn());

    expect(mockDiscussionService.toggleLike).toHaveBeenCalledWith(1, 4);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("toggles a comment like", async () => {
    const res = buildRes();
    mockDiscussionService.toggleCommentLike.mockResolvedValue({ success: true, data: { liked: false } });

    await toggleCommentLike({ params: { commentId: "7" }, user: { id: 4 } }, res, jest.fn());

    expect(mockDiscussionService.toggleCommentLike).toHaveBeenCalledWith(7, 4);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("reports a discussion through the service layer", async () => {
    const res = buildRes();
    mockDiscussionService.reportDiscussion.mockResolvedValue({ success: true, data: { id: 1 } });

    await reportDiscussion({ params: { discussionId: "1" }, body: { reason: "spam" }, user: { id: 4 } }, res, jest.fn());

    expect(mockDiscussionService.reportDiscussion).toHaveBeenCalledWith(1, 4, { reason: "spam" });
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("returns 401 when reporting a discussion without authentication", async () => {
    const res = buildRes();

    await reportDiscussion({ params: { discussionId: "1" }, body: { reason: "spam" }, user: null }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Authentication required" });
  });

  it("searches discussions through the service layer", async () => {
    const res = buildRes();
    mockDiscussionService.searchDiscussions.mockResolvedValue({ success: true, data: [] });

    await searchDiscussions({ query: { q: "test" } }, res, jest.fn());

    expect(mockDiscussionService.searchDiscussions).toHaveBeenCalledWith({ q: "test" });
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
