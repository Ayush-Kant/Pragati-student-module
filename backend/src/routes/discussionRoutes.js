import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  validateCreateDiscussion,
  validateUpdateDiscussion,
  validateCreateComment,
  validateUpdateComment,
  validateCreateReply,
  validateReportDiscussion,
  validateIdParam,
  validateCommentIdParam,
} from "../validations/discussionValidation.js";
import {
  createDiscussion,
  getAllDiscussions,
  getDiscussionDetails,
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
  getDiscussionStatistics,
} from "../controllers/discussionController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/discussions/statistics", getDiscussionStatistics);
router.get("/discussions/search", searchDiscussions);
router.get("/discussions", getAllDiscussions);
router.get("/discussions/:discussionId", validateRequest(validateIdParam, "params"), getDiscussionDetails);

router.post("/discussions", validateRequest(validateCreateDiscussion), createDiscussion);
router.post(
  "/discussions/:discussionId/comments",
  validateRequest(validateIdParam, "params"),
  validateRequest(validateCreateComment),
  addDiscussionComment,
);
router.post(
  "/comments/:commentId/replies",
  validateRequest(validateCommentIdParam, "params"),
  validateRequest(validateCreateReply),
  addCommentReply,
);
router.post(
  "/discussions/:discussionId/like",
  validateRequest(validateIdParam, "params"),
  toggleDiscussionLike,
);
router.post(
  "/comments/:commentId/like",
  validateRequest(validateCommentIdParam, "params"),
  toggleCommentLike,
);
router.post(
  "/discussions/:discussionId/report",
  validateRequest(validateIdParam, "params"),
  validateRequest(validateReportDiscussion),
  reportDiscussion,
);

router.put(
  "/discussions/:discussionId",
  validateRequest(validateIdParam, "params"),
  validateRequest(validateUpdateDiscussion),
  updateDiscussion,
);
router.put(
  "/comments/:commentId",
  validateRequest(validateCommentIdParam, "params"),
  validateRequest(validateUpdateComment),
  updateDiscussionComment,
);

router.delete("/discussions/:discussionId", validateRequest(validateIdParam, "params"), deleteDiscussion);
router.delete(
  "/comments/:commentId",
  validateRequest(validateCommentIdParam, "params"),
  removeDiscussionComment,
);

export default router;
