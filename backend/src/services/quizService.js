import { Quiz, QuizQuestion } from '../models/quizModel.js';
import { QuizOption } from '../models/quizOptionModel.js';
import {
  startQuizAttempt as runStartQuizAttempt,
  getAttemptById as fetchAttemptById,
  saveQuizAnswer as persistQuizAnswer,
  submitQuizAttempt as finalizeQuizAttempt,
  submitQuiz as completeQuizSubmission,
} from './quizAttemptService.js';
import {
  getAttemptResult as fetchAttemptResult,
  getPerformanceSummary as fetchPerformanceSummary,
  getQuizHistory as fetchQuizHistory,
} from './quizResultService.js';

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
    attributes: ['id', 'title', 'description', 'durationMinutes', 'passingScore', 'isActive'],
    include: [{
      model: QuizQuestion,
      as: 'questions',
      attributes: ['id', 'questionText', 'displayOrder'],
      order: [['displayOrder', 'ASC']],
      include: [{
        model: QuizOption,
        as: 'options',
        attributes: ['id', 'optionText', 'displayOrder'],
        order: [['displayOrder', 'ASC']],
      }],
    }],
  });

  if (!quiz) {
    const error = new Error('Quiz not found');
    error.status = 404;
    throw error;
  }

  return quiz.toJSON();
};

export const startQuizAttempt = runStartQuizAttempt;
export const getAttemptById = fetchAttemptById;
export const saveQuizAnswer = persistQuizAnswer;
export const submitQuizAttempt = finalizeQuizAttempt;
export const getAttemptResult = fetchAttemptResult;
export const getPerformanceSummary = fetchPerformanceSummary;
export const getQuizHistory = fetchQuizHistory;
export const submitQuiz = completeQuizSubmission;

export default {
  getAvailableQuizzes,
  getQuizDetails,
  startQuizAttempt,
  getAttemptById,
  saveQuizAnswer,
  submitQuizAttempt,
  getAttemptResult,
  getPerformanceSummary,
  getQuizHistory,
  submitQuiz,
};
