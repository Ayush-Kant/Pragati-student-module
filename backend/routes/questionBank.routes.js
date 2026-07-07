import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  createQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  generateQuiz,
} from "../controllers/questionBank.controller.js";
import {
  validateCreateQuestion,
  validateUpdateQuestion,
  validateGenerateQuiz,
} from "../validators/questionBank.validator.js";

const router = express.Router();

router.post(
  "/question-bank",
  authMiddleware,
  roleMiddleware("mentor"),
  validateCreateQuestion,
  createQuestion,
);

router.get(
  "/question-bank",
  authMiddleware,
  roleMiddleware("mentor"),
  getQuestions,
);

router.put(
  "/question-bank/:id",
  authMiddleware,
  roleMiddleware("mentor"),
  validateUpdateQuestion,
  updateQuestion,
);

router.delete(
  "/question-bank/:id",
  authMiddleware,
  roleMiddleware("mentor"),
  deleteQuestion,
);

router.post(
  "/assessments/:id/generate",
  authMiddleware,
  roleMiddleware("mentor"),
  validateGenerateQuiz,
  generateQuiz,
);

export default router;
