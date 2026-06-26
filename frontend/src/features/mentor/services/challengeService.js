// challengeService.js

// POST create challenge (Mentor)
POST /api/v1/challenges
Body: { title, description, maxScore, allowedLanguages }
Response: { challengeId }

// POST add test cases (Mentor)
POST /api/v1/challenges/:id/testcases
Body: { testCases: [{ input, expectedOutput, isHidden, weightPct, timeLimitMs }] }

// POST submit code (Student)
POST /api/v1/challenges/:id/submit
Body: { languageId, sourceCode }
Response: { submissionId, totalScore, passedTestCases, judge0Verdict, executionTimeMs }

// GET leaderboard (Shared)
GET /api/v1/challenges/:id/leaderboard
Response: { leaderboard: [{ rank, studentName, score, executionTimeMs }] }
