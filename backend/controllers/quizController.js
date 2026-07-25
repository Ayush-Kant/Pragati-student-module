import * as quizService from '../services/quizService.js';
import { validateQuizId, validateQuizSubmission } from '../validations/quizValidation.js';

export const getAvailableQuizzes = async (req, res, next) => {
  try {
    const quizzes = await quizService.getAvailableQuizzes();
    return res.status(200).json({ success: true, data: quizzes });
  } catch (error) {
    next(error);
  }
};

export const getQuizDetails = async (req, res, next) => {
  try {
    const { error } = validateQuizId(req.params.quizId);
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const quiz = await quizService.getQuizDetails(Number(req.params.quizId));
    return res.status(200).json({ success: true, data: quiz });
  } catch (error) {
    next(error);
  }
};

export const getQuizHistory = async (req, res, next) => {
  try {
    const studentId = req.user?.id || req.user?.uid || req.user?.userId;
    const history = await quizService.getQuizHistory(studentId);
    return res.status(200).json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};

export const submitQuiz = async (req, res, next) => {
  try {
    const { error } = validateQuizId(req.params.quizId);
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const validation = validateQuizSubmission(req.body);
    if (validation.error) {
      return res.status(400).json({ success: false, message: validation.error.message });
    }

    const studentId = req.user?.id || req.user?.uid || req.user?.userId;
    const result = await quizService.submitQuiz(Number(req.params.quizId), studentId, validation.value.answers);

    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
