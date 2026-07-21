import express from "express";
import authMiddleware from "../../../middleware/authMiddleware.js";

import {
  getAssessments,
  getAssessmentById,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  assignAssessment,
} from "../controllers/companyAssessment.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getAssessments);

router.post("/", authMiddleware, createAssessment);

router.get("/:id", authMiddleware, getAssessmentById);

router.put("/:id", authMiddleware, updateAssessment);

router.delete("/:id", authMiddleware, deleteAssessment);

router.patch(
  "/:id/assign",
  authMiddleware,
  assignAssessment
);

export default router;