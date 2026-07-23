// A helper to fake a network delay so your loading spinners actually show up
const simulateNetwork = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const challengeService = {
  
  // ── 1. POST create challenge (Mentor) ──
  // Contract: Body { title, description, maxScore, allowedLanguages } -> Res { challengeId }
  createChallenge: async (challengeData) => {
    await simulateNetwork(800); 
    
    const challengeId = "chal_" + Math.random().toString(36).substr(2, 9);
    
    // Save to browser's fake database
    const db = JSON.parse(localStorage.getItem('mock_db') || '{}');
    db[challengeId] = { ...challengeData, id: challengeId, testCases: [] };
    localStorage.setItem('mock_db', JSON.stringify(db));

    console.log(`🚀 [MOCK API] POST /api/v1/challenges | Created: ${challengeId}`);
    return { challengeId };
  },

  // ── 2. POST add test cases (Mentor) ──
  // Contract: Body { testCases: [...] }
  addTestCases: async (challengeId, testCasesPayload) => {
    await simulateNetwork(600);
    
    const db = JSON.parse(localStorage.getItem('mock_db') || '{}');
    if (db[challengeId]) {
      db[challengeId].testCases = testCasesPayload.testCases;
      localStorage.setItem('mock_db', JSON.stringify(db));
      console.log(`🚀 [MOCK API] POST /api/v1/challenges/${challengeId}/testcases | Saved!`);
      return { success: true };
    }
    throw new Error("Challenge not found");
  },

  // ── 3. POST submit code (Student) ──
  // Contract: Body { languageId, sourceCode } -> Res { submissionId, totalScore, passedTestCases, judge0Verdict, executionTimeMs }
  submitCode: async (challengeId, payload) => {
    await simulateNetwork(2000); // 2 seconds of Judge0 "thinking" time
    
    console.log(`🚀 [MOCK API] POST /api/v1/challenges/${challengeId}/submit | Evaluating...`);
    
    return {
      submissionId: "sub_" + Math.random().toString(36).substr(2, 9),
      totalScore: 100,
      passedTestCases: 45,
      judge0Verdict: "Accepted",
      executionTimeMs: 42
    };
  },

  // ── 4. GET leaderboard (Shared) ──
  // Contract: Res { leaderboard: [{ rank, studentName, score, executionTimeMs }] }
  getLeaderboard: async (challengeId) => {
    await simulateNetwork(500);
    
    console.log(`🚀 [MOCK API] GET /api/v1/challenges/${challengeId}/leaderboard`);
    
    return {
      leaderboard: [
        { rank: 1, studentName: "Sarah Jenkins", score: 100, executionTimeMs: 12 },
        { rank: 2, studentName: "Marcus Rossi", score: 100, executionTimeMs: 14 },
        { rank: 3, studentName: "David Chen", score: 95, executionTimeMs: 15 },
        { rank: 4, studentName: "Test Student (You)", score: 90, executionTimeMs: 42 }
      ]
    };
  }
};