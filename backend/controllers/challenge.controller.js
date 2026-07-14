import {
  createChallengeService,
  addTestCasesService,
  submitCodeService,
  getLeaderboardService,
} from "../services/challenge.service.js";

export const createChallenge = async (req, res) => {
  try {
    const { title, description, maxScore, allowedLanguages } = req.body;
    const result = await createChallengeService({ userId: req.user.uid, title, description, maxScore, allowedLanguages });
    return res.status(result.statusCode).json(
      result.success ? { success: true, challengeId: result.challengeId } : { success: false, message: result.message }
    );
  } catch (err) {
    console.error("createChallenge Error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const addTestCases = async (req, res) => {
  try {
    const result = await addTestCasesService({ challengeId: req.params.id, testCases: req.body.testCases });
    return res.status(result.statusCode).json(
      result.success ? { success: true, inserted: result.inserted } : { success: false, message: result.message }
    );
  } catch (err) {
    console.error("addTestCases Error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const submitCode = async (req, res) => {
  try {
    const { languageId, sourceCode } = req.body;
    const result = await submitCodeService({ challengeId: req.params.id, userId: req.user.uid, languageId, sourceCode });
    if (!result.success) return res.status(result.statusCode).json({ success: false, message: result.message });
    return res.status(200).json({
      success: true,
      submissionId: result.submissionId,
      totalScore: result.totalScore,
      passedTestCases: result.passedTestCases,
      totalTestCases: result.totalTestCases,
      judge0Verdict: result.judge0Verdict,
      executionTimeMs: result.executionTimeMs,
    });
  } catch (err) {
    console.error("submitCode Error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const result = await getLeaderboardService({ challengeId: req.params.id });
    if (!result.success && result.statusCode === 404)
      return res.status(404).json({ success: false, message: result.message });
    return res.status(200).json({ challengeId: result.challengeId, leaderboard: result.leaderboard });
  } catch (err) {
    console.error("getLeaderboard Error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
