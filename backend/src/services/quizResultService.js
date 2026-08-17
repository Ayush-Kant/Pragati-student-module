import { Quiz, QuizQuestion, QuizAttempt, QuizAnswer } from '../models/quizModel.js';
import { evaluateAnswers } from '../utils/quizScoring.js';

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

export const getQuizHistory = async (studentId) => {
  const attempts = await QuizAttempt.findAll({
    where: { studentId },
    include: [{ model: Quiz, as: 'quiz', attributes: ['id', 'title'] }],
    order: [['createdAt', 'DESC']],
  });

  return attempts.map((attempt) => attempt.toJSON());
};

export const getAttemptResult = async (attemptId, studentId) => {
  const attempt = await QuizAttempt.findOne({
    where: { id: attemptId },
    include: [{ model: Quiz, as: 'quiz', attributes: ['id', 'title', 'passingScore'] }, { model: QuizAnswer, as: 'answers' }],
  });

  if (!attempt) {
    const error = new Error('Attempt not found');
    error.status = 404;
    throw error;
  }

  if (Number(attempt.studentId) !== Number(studentId)) {
    const error = new Error('Unauthorized');
    error.status = 403;
    throw error;
  }

  const questions = await QuizQuestion.findAll({ where: { quizId: attempt.quizId }, attributes: ['id', 'correctOptionId'] });
  const answers = attempt.answers.map((answer) => answer.toJSON());
  const evaluation = evaluateAnswers(questions.map((question) => question.toJSON()), answers);

  return {
    quizTitle: attempt.quiz.title,
    attemptId: attempt.id,
    score: evaluation.score,
    percentage: evaluation.percentage,
    correctAnswers: evaluation.correctAnswers,
    incorrectAnswers: evaluation.incorrectAnswers,
    unanswered: evaluation.unanswered,
    passed: attempt.passed,
    startedAt: attempt.startedAt,
    submittedAt: attempt.submittedAt,
  };
};

export const getPerformanceSummary = async (studentId) => {
  const attempts = await QuizAttempt.findAll({ where: { studentId, status: 'submitted' }, attributes: ['id', 'quizId', 'score', 'percentage', 'passed'] });
  return buildPerformanceSummary(attempts.map((attempt) => attempt.toJSON()));
};

export default {
  buildPerformanceSummary,
  getQuizHistory,
  getAttemptResult,
  getPerformanceSummary,
};
