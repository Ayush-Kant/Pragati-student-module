// src/utils/codingChallengeHelpers.js

// ===============================
// Coding Challenge Formatter
// ===============================

const formatChallengeData = (challenge) => ({
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    difficulty: challenge.difficulty,
    category: challenge.category,
    points: challenge.points,
    createdAt: challenge.created_at,
    updatedAt: challenge.updated_at,
});

// ===============================
// Submission Formatter
// ===============================

const formatSubmissionData = (submission) => ({
    id: submission.id,
    challengeId: submission.challenge_id,
    studentId: submission.student_id,
    language: submission.language,
    sourceCode: submission.source_code,
    status: submission.status,
    score: submission.score,
    submittedAt: submission.created_at,
});

// ===============================
// Execution Result Formatter
// ===============================

const formatExecutionResult = (result) => ({
    id: result.id,
    submissionId: result.submission_id,
    stdout: result.stdout,
    stderr: result.stderr,
    compileOutput: result.compile_output,
    executionTime: result.time,
    memory: result.memory,
    status: result.status,
});

// ===============================
// Leaderboard Formatter
// ===============================

const formatLeaderboardEntry = (entry) => ({
    studentId: entry.student_id,
    score: entry.score,
    rank: entry.rank,
    updatedAt: entry.updated_at,
});

// ===============================
// Test Case Formatter
// ===============================

const formatTestCaseData = (testCase) => ({
    id: testCase.id,
    challengeId: testCase.challenge_id,
    input: testCase.input,
    expectedOutput: testCase.expected_output,
    visibility: testCase.visibility,
});

// ===============================
// Standard API Response
// ===============================

const successResponse = (message, data = null) => ({
    success: true,
    message,
    data,
});

const errorResponse = (message, errors = null) => ({
    success: false,
    message,
    errors,
});

module.exports = {
    formatChallengeData,
    formatSubmissionData,
    formatExecutionResult,
    formatLeaderboardEntry,
    formatTestCaseData,
    successResponse,
    errorResponse,
};