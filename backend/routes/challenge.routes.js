import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import { createChallenge, addTestCases, submitCode, getLeaderboard } from "../controllers/challenge.controller.js";
import { validateCreateChallenge, validateAddTestCases, validateSubmitCode } from "../validators/challenge.validator.js";

const router = express.Router();

router.post("/challenges", authMiddleware, roleMiddleware("mentor"), validateCreateChallenge, createChallenge);
router.post("/challenges/:id/testcases", authMiddleware, roleMiddleware("mentor"), validateAddTestCases, addTestCases);
router.post("/challenges/:id/submit", authMiddleware, roleMiddleware("student"), validateSubmitCode, submitCode);
router.get("/challenges/:id/leaderboard", authMiddleware, getLeaderboard);

export default router;
