import { Quiz, QuizQuestion, QuizOption, QuizAttempt, QuizAnswer } from '../models/quizModel.js';
import { sequelize } from '../config/sequelize.js';
import { calculateScore, buildPerformanceSummary, evaluateAnswers } from '../utils/quizHelpers.js';
import { DEFAULT_PASSING_SCORE } from '../constants/quizConstants.js';

export const getAvailableQuizzes = async () => {
  const quizzes = await Quiz.findAll({
    where: { isActive: true },
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'title', 'description', 'durationMinutes', 'passingScore', 'isActive', 'createdAt', 'updatedAt'],
  });

  return quizzes.map((quiz) => quiz.toJSON());
};

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

  // Fetch questions and options but hide correct flags when attempt is active
  const questions = await QuizQuestion.findAll({
    where: { quizId: attempt.quizId },
    attributes: ['id', 'questionText', 'displayOrder', 'correctOptionId'],
    include: [{ model: QuizOption, as: 'options', attributes: ['id', 'optionText', 'displayOrder', 'isCorrect'] }],
    order: [['displayOrder', 'ASC']],
  });

  const attemptJson = attempt.toJSON();
  const answers = attemptJson.answers || [];

  const questionData = questions.map((q) => {
    const qObj = q.toJSON();
    // hide correctOptionId unless attempt submitted
    if (attempt.status === 'in_progress') {
      delete qObj.correctOptionId;
      qObj.options = qObj.options.map((opt) => {
        const o = { id: opt.id, optionText: opt.optionText, displayOrder: opt.displayOrder };
        return o;
      });
    } else {
      qObj.options = qObj.options.map((opt) => ({ id: opt.id, optionText: opt.optionText, displayOrder: opt.displayOrder, isCorrect: opt.isCorrect }));
    }

    const userAnswer = answers.find((a) => Number(a.questionId) === Number(qObj.id));
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

  // upsert answer: if selectedOptionId is null => remove
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

  const created = await QuizAnswer.create({ quizAttemptId: attemptId, questionId, selectedOptionId, isCorrect: Number(question.correctOptionId) === Number(selectedOptionId) });
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

    const questions = await QuizQuestion.findAll({ where: { quizId: attempt.quizId }, attributes: ['id', 'correctOptionId'], transaction });
    if (!questions.length) {
      const error = new Error('Quiz has no questions');
      error.status = 400;
      throw error;
    }

    const answers = await QuizAnswer.findAll({ where: { quizAttemptId: attemptId }, attributes: ['id', 'questionId', 'selectedOptionId'], transaction });

    const evaluation = evaluateAnswers(questions.map((q) => q.toJSON()), answers.map((a) => a.toJSON()));

    // update answer records isCorrect flag
    const answersByQuestion = new Map(answers.map((a) => [Number(a.questionId), a]));
    for (const q of questions) {
      const ans = answersByQuestion.get(Number(q.id));
      if (ans) {
        ans.isCorrect = Number(q.correctOptionId) === Number(ans.selectedOptionId);
        await ans.save({ transaction });
      }
    }

    // determine passing score from quiz
    const quiz = await Quiz.findOne({ where: { id: attempt.quizId }, attributes: ['passingScore'], transaction });
    const passingScore = quiz ? quiz.passingScore : DEFAULT_PASSING_SCORE;

    // update attempt
    attempt.score = evaluation.score;
    attempt.totalQuestions = evaluation.totalQuestions;
    attempt.percentage = evaluation.percentage;
    attempt.passed = evaluation.percentage >= (passingScore || DEFAULT_PASSING_SCORE);
    attempt.status = 'submitted';
    attempt.submittedAt = new Date();
    await attempt.save({ transaction });

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
    };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

export const getAttemptResult = async (attemptId, studentId) => {
  const attempt = await QuizAttempt.findOne({ where: { id: attemptId }, include: [{ model: Quiz, as: 'quiz', attributes: ['id', 'title', 'passingScore'] }, { model: QuizAnswer, as: 'answers' }], });
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
  const answers = attempt.answers.map((a) => a.toJSON());
  const evaluation = evaluateAnswers(questions.map((q) => q.toJSON()), answers);

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
  const totalAttempts = attempts.length;
  const completedQuizzes = new Set(attempts.map((a) => a.quizId)).size;
  const numericPercentages = attempts.map((a) => Number(a.percentage || 0));
  const averageScore = totalAttempts > 0 ? Number((numericPercentages.reduce((s, v) => s + v, 0) / totalAttempts).toFixed(2)) : 0;
  const highestScore = totalAttempts > 0 ? Math.max(...numericPercentages) : 0;
  const passed = attempts.filter((a) => a.passed).length;
  const failed = totalAttempts - passed;

  return {
    totalAttempts,
    completedQuizzes,
    averageScore,
    highestScore,
    passed,
    failed,
  };
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
