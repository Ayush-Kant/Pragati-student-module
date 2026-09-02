import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  getAssessment,
  getHistory,
  getResult,
  listAssessments,
  recordTabSwitch,
  saveAnswer,
  startAssessment,
  submitAssessment,
} from "../controllers/studentAssessment.controller.js";

const router = express.Router();

router.use(authMiddleware, roleMiddleware("student"));

router.get("/", listAssessments);
router.get("/history", getHistory);
router.get("/:assessmentId", getAssessment);
router.post("/:assessmentId/start", startAssessment);
router.put("/attempts/:attemptId/questions/:questionId/answer", saveAnswer);
router.post("/attempts/:attemptId/tab-switch", recordTabSwitch);
router.post("/attempts/:attemptId/submit", submitAssessment);
router.get("/attempts/:attemptId/result", getResult);

export default router;
