import request from "supertest";
import express from "express";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

const authMiddleware = jest.fn((req, _res, next) => {
  req.user = { id: 1 };
  next();
});

const discussionController = {
  getDiscussionStatistics: jest.fn((req, res) => res.status(200).json({ success: true, data: { totalDiscussions: 1 } })),
  searchDiscussions: jest.fn((req, res) => res.status(200).json({ success: true, data: [] })),
  getAllDiscussions: jest.fn((req, res) => res.status(200).json({ success: true, data: [] })),
  getDiscussionDetails: jest.fn((req, res) => res.status(200).json({ success: true, data: { id: Number(req.params.discussionId) } })),
  createDiscussion: jest.fn((req, res) => res.status(201).json({ success: true, data: { id: 1 } })),
  addDiscussionComment: jest.fn((req, res) => res.status(201).json({ success: true, data: { id: 2 } })),
  addCommentReply: jest.fn((req, res) => res.status(201).json({ success: true, data: { id: 3 } })),
  updateDiscussion: jest.fn((req, res) => res.status(200).json({ success: true, data: { id: Number(req.params.discussionId) } })),
  updateDiscussionComment: jest.fn((req, res) => res.status(200).json({ success: true, data: { id: Number(req.params.commentId) } })),
  deleteDiscussion: jest.fn((req, res) => res.status(200).json({ success: true })),
  removeDiscussionComment: jest.fn((req, res) => res.status(200).json({ success: true })),
  toggleDiscussionLike: jest.fn((req, res) => res.status(200).json({ success: true, data: { liked: true } })),
  toggleCommentLike: jest.fn((req, res) => res.status(200).json({ success: true, data: { liked: true } })),
  reportDiscussion: jest.fn((req, res) => res.status(201).json({ success: true, data: { id: 5 } })),
};

jest.unstable_mockModule("../middleware/authMiddleware.js", () => ({ default: authMiddleware }));
jest.unstable_mockModule("../middleware/validateRequest.js", () => ({ validateRequest: () => (req, _res, next) => next() }));
jest.unstable_mockModule("../controllers/discussionController.js", () => discussionController);

const routerModule = await import("../routes/discussionRoutes.js");
const router = routerModule.default;

const app = express();
app.use(express.json());
app.use("/api/student", router);

describe("discussion routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authMiddleware.mockImplementation((req, _res, next) => {
      req.user = { id: 1 };
      next();
    });
  });

  it("handles discussion statistics route", async () => {
    const res = await request(app).get("/api/student/discussions/statistics");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("handles list and search routes", async () => {
    const listRes = await request(app).get("/api/student/discussions");
    const searchRes = await request(app).get("/api/student/discussions/search?q=react");

    expect(listRes.status).toBe(200);
    expect(searchRes.status).toBe(200);
  });

  it("handles create, read, update, delete discussion routes", async () => {
    const createRes = await request(app).post("/api/student/discussions").send({ title: "Hello", content: "World" });
    const detailRes = await request(app).get("/api/student/discussions/1");
    const updateRes = await request(app).put("/api/student/discussions/1").send({ title: "Updated" });
    const deleteRes = await request(app).delete("/api/student/discussions/1");

    expect(createRes.status).toBe(201);
    expect(detailRes.status).toBe(200);
    expect(updateRes.status).toBe(200);
    expect(deleteRes.status).toBe(200);
  });

  it("handles comment and reply routes", async () => {
    const commentRes = await request(app).post("/api/student/discussions/1/comments").send({ content: "comment" });
    const replyRes = await request(app).post("/api/student/comments/2/replies").send({ content: "reply" });
    const updateCommentRes = await request(app).put("/api/student/comments/2").send({ content: "updated" });
    const deleteCommentRes = await request(app).delete("/api/student/comments/2");

    expect(commentRes.status).toBe(201);
    expect(replyRes.status).toBe(201);
    expect(updateCommentRes.status).toBe(200);
    expect(deleteCommentRes.status).toBe(200);
  });

  it("handles like and report routes", async () => {
    const discussionLikeRes = await request(app).post("/api/student/discussions/1/like");
    const commentLikeRes = await request(app).post("/api/student/comments/2/like");
    const reportRes = await request(app).post("/api/student/discussions/1/report").send({ reason: "spam", reportType: "discussion" });

    expect(discussionLikeRes.status).toBe(200);
    expect(commentLikeRes.status).toBe(200);
    expect(reportRes.status).toBe(201);
  });

  it("returns 401 when auth token is missing", async () => {
    authMiddleware.mockImplementationOnce((_req, res) => {
      res.status(401).json({ success: false, message: "No token provided" });
    });

    const res = await request(app).post("/api/student/discussions").send({ title: "Hello", content: "World" });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ success: false, message: "No token provided" });
  });

  it("returns 401 when auth token is invalid", async () => {
    authMiddleware.mockImplementationOnce((_req, res) => {
      res.status(401).json({ success: false, message: "Invalid token" });
    });

    const res = await request(app).post("/api/student/discussions").send({ title: "Hello", content: "World" });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ success: false, message: "Invalid token" });
  });
});
