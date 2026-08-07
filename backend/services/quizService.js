import { Quiz, QuizQuestion, QuizOption, QuizAttempt, QuizAnswer } from '../models/quizModel.js';
import { sequelize } from '../config/sequelize.js';
import { calculateScore, buildPerformanceSummary } from '../utils/quizHelpers.js';
import { DEFAULT_PASSING_SCORE } from '../constants/quizConstants.js';

export const getAvailableQuizzes = async () => {
  const quizzes = await Quiz.findAll({
    where: { isActive: true },
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'title', 'description', 'durationMinutes', 'passingScore', 'isActive', 'createdAt', 'updatedAt'],
  });

  return quizzes.map((quiz) => quiz.toJSON());
};

export const getQuizDetails = async (quizId) => {
  const quiz = await Quiz.findOne({
    where: { id: quizId, isActive: true },
    attributes: ['id', 'title', 'description', 'durationMinutes', 'passingScore', 'isActive', 'createdAt', 'updatedAt'],
    include: [{
      model: QuizQuestion,
      as: 'questions',
      attributes: ['id', 'questionText', 'displayOrder'],
      include: [{
        model: QuizOption,
        as: 'options',
        attributes: ['id', 'optionText', 'displayOrder'],
      }],
    }],
    order: [
      [{ model: QuizQuestion, as: 'questions' }, 'displayOrder', 'ASC'],
      [{ model: QuizQuestion, as: 'questions' }, { model: QuizOption, as: 'options' }, 'displayOrder', 'ASC'],
    ],
  });

  if (!quiz) {
    const error = new Error('Quiz not found');
    error.status = 404;
    throw error;
  }

  return quiz.toJSON();
};

export const getQuizHistory = async (studentId) => {
  const attempts = await QuizAttempt.findAll({
    where: { studentId },
    order: [['submittedAt', 'DESC']],
    include: [{ model: Quiz, as: 'quiz', attributes: ['id', 'title'] }],
    attributes: ['id', 'quizId', 'score', 'totalQuestions', 'percentage', 'passed', 'submittedAt'],
  });

  const history = attempts.map((attempt) => attempt.toJSON());
  const summary = buildPerformanceSummary(history);

  return {
    history,
    summary,
  };
};

export const submitQuiz = async (quizId, studentId, submittedAnswers = []) => {
  const quiz = await Quiz.findOne({
    where: { id: quizId, isActive: true },
    attributes: ['id', 'title', 'passingScore'],
  });

  if (!quiz) {
    const error = new Error('Quiz not found');
    error.status = 404;
    throw error;
  }

  const questions = await QuizQuestion.findAll({
    where: { quizId },
    attributes: ['id', 'correctOptionId'],
    order: [['displayOrder', 'ASC']],
  });

  if (!questions.length) {
    const error = new Error('This quiz has no questions');
    error.status = 400;
    throw error;
  }

  const existingAttempt = await QuizAttempt.findOne({
    where: { quizId, studentId, status: 'submitted' },
  });

  if (existingAttempt) {
    const error = new Error('Quiz has already been submitted by this student');
    error.status = 409;
    throw error;
  }

  const submittedQuestionIds = submittedAnswers.map((answer) => Number(answer.questionId));
  const uniqueQuestionIds = new Set(submittedQuestionIds);
  if (uniqueQuestionIds.size !== submittedAnswers.length) {
    const error = new Error('Duplicate answers for the same question are not allowed');
    error.status = 400;
    throw error;
  }

  const validQuestionIds = new Set(questions.map((question) => Number(question.id)));
  const invalidQuestionIds = submittedQuestionIds.filter((questionId) => !validQuestionIds.has(questionId));
  if (invalidQuestionIds.length > 0) {
    const error = new Error('One or more submitted answers reference invalid questions');
    error.status = 400;
    throw error;
  }

  const questionIds = questions.map((question) => question.id);
  const options = await QuizOption.findAll({
    where: { quizQuestionId: questionIds },
    attributes: ['id', 'quizQuestionId'],
  });

  const optionsByQuestion = new Map();
  options.forEach((option) => {
    const questionOptions = optionsByQuestion.get(option.quizQuestionId) || new Set();
    questionOptions.add(option.id);
    optionsByQuestion.set(option.quizQuestionId, questionOptions);
  });

  const invalidOptions = submittedAnswers.filter((answer) => {
    const questionOptions = optionsByQuestion.get(Number(answer.questionId));
    return !questionOptions?.has(Number(answer.selectedOptionId));
  });

  if (invalidOptions.length > 0) {
    const error = new Error('One or more selected answers are invalid for the quiz questions');
    error.status = 400;
    throw error;
  }

  const { score, totalQuestions, percentage } = calculateScore(questions.map((question) => question.toJSON()), submittedAnswers);
  const passed = percentage >= (quiz.passingScore || DEFAULT_PASSING_SCORE);

  const transaction = await sequelize.transaction();
  try {
    const attempt = await QuizAttempt.create({
      quizId,
      studentId,
      status: 'submitted',
      score,
      totalQuestions,
      percentage,
      passed,
      submittedAt: new Date(),
    }, { transaction });

    const answerRecords = submittedAnswers.map((answer) => ({
      quizAttemptId: attempt.id,
      questionId: Number(answer.questionId),
      selectedOptionId: Number(answer.selectedOptionId),
      isCorrect: questions.some((question) => Number(question.id) === Number(answer.questionId) && Number(question.correctOptionId) === Number(answer.selectedOptionId)),
    }));

    await QuizAnswer.bulkCreate(answerRecords, { transaction });
    await transaction.commit();

    return {
      attempt: {
        id: attempt.id,
        quizId: attempt.quizId,
        studentId: attempt.studentId,
        score: attempt.score,
        totalQuestions: attempt.totalQuestions,
        percentage: attempt.percentage,
        passed: attempt.passed,
        submittedAt: attempt.submittedAt,
      },
      result: {
        quizTitle: quiz.title,
        score: attempt.score,
        totalQuestions: attempt.totalQuestions,
        percentage: attempt.percentage,
        passed: attempt.passed,
        passingScore: quiz.passingScore || DEFAULT_PASSING_SCORE,
      },
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
