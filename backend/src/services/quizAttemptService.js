import { Quiz, QuizQuestion, QuizOption, QuizAttempt, QuizAnswer, QuizResult } from '../models/quizModel.js';
import { sequelize } from '../config/sequelize.js';
import { evaluateAnswers } from '../utils/quizScoring.js';
import { DEFAULT_PASSING_SCORE } from '../constants/quizConstants.js';

export const startQuizAttempt = async (quizId, studentId) => {
  const quiz = await Quiz.findOne({ where: { id: quizId, isActive: true }, attributes: ['id', 'title'] });
  if (!quiz) {
    const error = new Error('Quiz not found');
    error.status = 404;
    throw error;
  }

  const existing = await QuizAttempt.findOne({ where: { quizId, studentId, status: 'in_progress' } });
  if (existing) return existing.toJSON();

  const questionsCount = await QuizQuestion.count({ where: { quizId } });

  const attempt = await QuizAttempt.create({
    quizId,
    studentId,
    status: 'in_progress',
    totalQuestions: questionsCount,
    startedAt: new Date(),
  });

  return attempt.toJSON();
};

export const getAttemptById = async (attemptId, studentId) => {
  const attempt = await QuizAttempt.findOne({
    where: { id: attemptId },
    include: [
      { model: Quiz, as: 'quiz', attributes: ['id', 'title', 'durationMinutes', 'passingScore'] },
      { model: QuizAnswer, as: 'answers', attributes: ['id', 'questionId', 'selectedOptionId', 'isCorrect'] },
    ],
  });

  if (!attempt) {
    const error = new Error('Attempt not found');
    error.status = 404;
    throw error;
  }

  if (Number(attempt.studentId) !== Number(studentId)) {
    const error = new Error('Unauthorized access to attempt');
    error.status = 403;
    throw error;
  }

  const questions = await QuizQuestion.findAll({
    where: { quizId: attempt.quizId },
    attributes: ['id', 'questionText', 'displayOrder', 'correctOptionId'],
    include: [{ model: QuizOption, as: 'options', attributes: ['id', 'optionText', 'displayOrder', 'isCorrect'] }],
    order: [['displayOrder', 'ASC']],
  });

  const attemptJson = attempt.toJSON();
  const answers = attemptJson.answers || [];

  const questionData = questions.map((question) => {
    const qObj = question.toJSON();
    if (attempt.status === 'in_progress') {
      delete qObj.correctOptionId;
      qObj.options = qObj.options.map((option) => ({
        id: option.id,
        optionText: option.optionText,
        displayOrder: option.displayOrder,
      }));
    } else {
      qObj.options = qObj.options.map((option) => ({
        id: option.id,
        optionText: option.optionText,
        displayOrder: option.displayOrder,
        isCorrect: option.isCorrect,
      }));
    }

    const userAnswer = answers.find((answer) => Number(answer.questionId) === Number(qObj.id));
    qObj.userSelectedOptionId = userAnswer ? userAnswer.selectedOptionId : null;
    return qObj;
  });

  return {
    attempt: attemptJson,
    questions: questionData,
  };
};

export const saveQuizAnswer = async (attemptId, studentId, questionId, selectedOptionId) => {
  const attempt = await QuizAttempt.findOne({ where: { id: attemptId } });
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
  if (attempt.status !== 'in_progress') {
    const error = new Error('Cannot modify answers for non-active attempts');
    error.status = 409;
    throw error;
  }

  const question = await QuizQuestion.findOne({ where: { id: questionId, quizId: attempt.quizId } });
  if (!question) {
    const error = new Error('Question not found for this quiz');
    error.status = 400;
    throw error;
  }

  if (selectedOptionId !== null && selectedOptionId !== undefined) {
    const option = await QuizOption.findOne({ where: { id: selectedOptionId, quizQuestionId: questionId } });
    if (!option) {
      const error = new Error('Option not valid for question');
      error.status = 400;
      throw error;
    }
  }

  const existing = await QuizAnswer.findOne({ where: { quizAttemptId: attemptId, questionId } });
  if (selectedOptionId === null || selectedOptionId === undefined) {
    if (existing) await existing.destroy();
    return { success: true };
  }

  if (existing) {
    existing.selectedOptionId = selectedOptionId;
    existing.isCorrect = Number(question.correctOptionId) === Number(selectedOptionId);
    await existing.save();
    return existing.toJSON();
  }

  const created = await QuizAnswer.create({
    quizAttemptId: attemptId,
    questionId,
    selectedOptionId,
    isCorrect: Number(question.correctOptionId) === Number(selectedOptionId),
  });

  return created.toJSON();
};

export const submitQuizAttempt = async (attemptId, studentId) => {
  const transaction = await sequelize.transaction();
  try {
    const attempt = await QuizAttempt.findOne({ where: { id: attemptId }, transaction });
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

    if (attempt.status !== 'in_progress') {
      const error = new Error('Attempt is not active or already submitted');
      error.status = 409;
      throw error;
    }

    const questions = await QuizQuestion.findAll({
      where: { quizId: attempt.quizId },
      attributes: ['id', 'correctOptionId'],
      transaction,
    });

    if (!questions.length) {
      const error = new Error('Quiz has no questions');
      error.status = 400;
      throw error;
    }

    const answers = await QuizAnswer.findAll({
      where: { quizAttemptId: attemptId },
      attributes: ['id', 'questionId', 'selectedOptionId'],
      transaction,
    });

    const evaluation = evaluateAnswers(
      questions.map((question) => question.toJSON()),
      answers.map((answer) => answer.toJSON()),
    );

    const answersByQuestion = new Map(answers.map((answer) => [Number(answer.questionId), answer]));
    for (const question of questions) {
      const answer = answersByQuestion.get(Number(question.id));
      if (answer) {
        answer.isCorrect = Number(question.correctOptionId) === Number(answer.selectedOptionId);
        await answer.save({ transaction });
      }
    }

    const quiz = await Quiz.findOne({ where: { id: attempt.quizId }, attributes: ['passingScore'], transaction });
    const passingScore = quiz ? quiz.passingScore : DEFAULT_PASSING_SCORE;

    attempt.score = evaluation.score;
    attempt.totalQuestions = evaluation.totalQuestions;
    attempt.percentage = evaluation.percentage;
    attempt.passed = evaluation.percentage >= (passingScore || DEFAULT_PASSING_SCORE);
    attempt.status = 'submitted';
    attempt.submittedAt = new Date();
    await attempt.save({ transaction });

    // Create QuizResult record
    const result = await QuizResult.create({
      quizAttemptId: attempt.id,
      studentId: attempt.studentId,
      quizId: attempt.quizId,
      score: attempt.score,
      percentage: attempt.percentage,
      passed: attempt.passed,
    }, { transaction });

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
      result: evaluation,
      resultId: result.id,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const submitQuiz = async (quizId, studentId, answers) => {
  const transaction = await sequelize.transaction();
  try {
    const quiz = await Quiz.findOne({ where: { id: quizId, isActive: true }, attributes: ['id', 'passingScore', 'title'], transaction });
    if (!quiz) {
      const error = new Error('Quiz not found');
      error.status = 404;
      throw error;
    }

    const attempt = await QuizAttempt.findOne({ where: { quizId, studentId, status: 'in_progress' }, transaction });
    if (!attempt) {
      const error = new Error('No active attempt found');
      error.status = 404;
      throw error;
    }

    // Save all provided answers
    for (const answer of answers) {
      const { questionId, selectedOptionId } = answer;
      const question = await QuizQuestion.findOne({ where: { id: questionId, quizId }, transaction });
      if (!question) continue;

      const existing = await QuizAnswer.findOne({ 
        where: { quizAttemptId: attempt.id, questionId }, 
        transaction 
      });

      const isCorrect = selectedOptionId !== null && Number(question.correctOptionId) === Number(selectedOptionId);

      if (existing) {
        existing.selectedOptionId = selectedOptionId;
        existing.isCorrect = isCorrect;
        await existing.save({ transaction });
      } else if (selectedOptionId !== null) {
        await QuizAnswer.create({
          quizAttemptId: attempt.id,
          questionId,
          selectedOptionId,
          isCorrect,
        }, { transaction });
      }
    }

    const questions = await QuizQuestion.findAll({ where: { quizId }, attributes: ['id', 'correctOptionId'], transaction });
    const storedAnswers = await QuizAnswer.findAll({ where: { quizAttemptId: attempt.id }, transaction });
    
    const evaluation = evaluateAnswers(
      questions.map((question) => question.toJSON()), 
      storedAnswers.map((answer) => answer.toJSON())
    );

    const passingScore = quiz.passingScore || DEFAULT_PASSING_SCORE;

    attempt.score = evaluation.score;
    attempt.totalQuestions = evaluation.totalQuestions;
    attempt.percentage = evaluation.percentage;
    attempt.passed = evaluation.percentage >= passingScore;
    attempt.status = 'submitted';
    attempt.submittedAt = new Date();
    await attempt.save({ transaction });

    // Create QuizResult record
    const result = await QuizResult.create({
      quizAttemptId: attempt.id,
      studentId: attempt.studentId,
      quizId: attempt.quizId,
      score: attempt.score,
      percentage: attempt.percentage,
      passed: attempt.passed,
    }, { transaction });

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
      result: evaluation,
      resultId: result.id,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export default {
  startQuizAttempt,
  getAttemptById,
  saveQuizAnswer,
  submitQuizAttempt,
  submitQuiz,
};
