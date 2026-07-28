export const calculateScore = (questions = [], submittedAnswers = []) => {
  const totalQuestions = questions.length || submittedAnswers.length || 0;
  let score = 0;

  const questionMap = new Map(questions.map((question) => [question.id, question]));

  submittedAnswers.forEach((answer) => {
    const question = questionMap.get(answer.questionId);
    if (question && Number(answer.selectedOptionId) === Number(question.correctOptionId)) {
      score += 1;
    }
  });

  const percentage = totalQuestions > 0 ? Number(((score / totalQuestions) * 100).toFixed(2)) : 0;

  return {
    score,
    totalQuestions,
    percentage,
  };
};

export const buildPerformanceSummary = (attempts = []) => {
  const totalAttempts = attempts.length;
  const numericScores = attempts.map((attempt) => Number(attempt.score || 0));
  const numericPercentages = attempts.map((attempt) => Number(attempt.percentage || 0));
  const passCount = attempts.filter((attempt) => {
    if (attempt.passed !== undefined && attempt.passed !== null) {
      return Boolean(attempt.passed);
    }
    return Number(attempt.percentage || 0) >= 60;
  }).length;
  const failCount = totalAttempts - passCount;

  const averageScore = totalAttempts > 0
    ? Number((numericScores.reduce((sum, score) => sum + score, 0) / totalAttempts).toFixed(2))
    : 0;
  const highestScore = totalAttempts > 0 ? Math.max(...numericScores) : 0;
  const lowestScore = totalAttempts > 0 ? Math.min(...numericScores) : 0;
  const averagePercentage = totalAttempts > 0
    ? Number((numericPercentages.reduce((sum, value) => sum + value, 0) / totalAttempts).toFixed(2))
    : 0;
  const passRate = totalAttempts > 0 ? Number(((passCount / totalAttempts) * 100).toFixed(2)) : 0;
  const failRate = totalAttempts > 0 ? Number(((failCount / totalAttempts) * 100).toFixed(2)) : 0;

  return {
    totalAttempts,
    averageScore,
    highestScore,
    lowestScore,
    averagePercentage,
    passCount,
    passedCount: passCount,
    failCount,
    failedCount: failCount,
    passRate,
    failRate,
  };
};
