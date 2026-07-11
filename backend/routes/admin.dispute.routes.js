import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  getDisputes,
  getDispute,
  reviewDispute,
  resolveDispute,
  escalateDispute,
  addDisputeNote,
} from "../controllers/admin.dispute.controller.js";

import {
  validateDisputeId,
  validateResolveDispute,
  validateEscalateDispute,
  validateAddDisputeNote,
} from "../validators/admin.dispute.validator.js";

const router = express.Router();

// GET /api/v1/admin/disputes
router.get(
  "/",
  authMiddleware,
  getDisputes
);

// GET /api/v1/admin/disputes/:id
router.get(
  "/:id",
  authMiddleware,
  validateDisputeId,
  getDispute
);

// PATCH /api/v1/admin/disputes/:id/review
router.patch(
  "/:id/review",
  authMiddleware,
  validateDisputeId,
  reviewDispute
);

// PATCH /api/v1/admin/disputes/:id/resolve
router.patch(
  "/:id/resolve",
  authMiddleware,
  validateDisputeId,
  validateResolveDispute,
  resolveDispute
);

// PATCH /api/v1/admin/disputes/:id/escalate
router.patch(
  "/:id/escalate",
  authMiddleware,
  validateDisputeId,
  validateEscalateDispute,
  escalateDispute
);

// POST /api/v1/admin/disputes/:id/notes
router.post(
  "/:id/notes",
  authMiddleware,
  validateDisputeId,
  validateAddDisputeNote,
  addDisputeNote
);

export default router;